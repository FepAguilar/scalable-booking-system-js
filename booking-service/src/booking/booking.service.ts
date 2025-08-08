import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Booking, PrismaClient, Prisma } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ExternalService } from '../services/external.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly externalService: ExternalService,
  ) {}

  private toDate(value?: string): Date | undefined {
    return value ? new Date(value) : undefined;
  }

  private buildTimeOverlapWhere(
    workspaceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string,
  ): Prisma.BookingWhereInput {
    const overlap: Prisma.BookingWhereInput = {
      workspaceId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      // Overlap when (start < existing.end) && (end > existing.start)
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      status: { in: ['PENDING', 'CONFIRMED'] },
    };
    return overlap;
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    if (!(start < end)) {
      throw new BadRequestException('startTime must be before endTime');
    }

    // Validate user exists
    await this.externalService.validateUser(dto.userId);

    // Validate workspace exists
    await this.externalService.validateWorkspace(dto.workspaceId);

    // Check for overlapping bookings
    const overlapping = await this.prisma.booking.findFirst({
      where: this.buildTimeOverlapWhere(dto.workspaceId, start, end),
    });
    if (overlapping) {
      throw new BadRequestException(
        'Time slot overlaps with an existing booking',
      );
    }

    // Create the booking
    const booking = await this.prisma.booking.create({
      data: {
        userId: dto.userId,
        workspaceId: dto.workspaceId,
        startTime: start,
        endTime: end,
        status: dto.status ?? 'PENDING',
      },
    });

    // Orchestrate external services (non-blocking)
    this.orchestrateExternalServices(booking).catch((error) => {
      console.error('Failed to orchestrate external services:', error);
    });

    return booking;
  }

  private async orchestrateExternalServices(booking: Booking): Promise<void> {
    try {
      // Calculate booking duration in hours for pricing
      const durationHours =
        (booking.endTime.getTime() - booking.startTime.getTime()) /
        (1000 * 60 * 60);
      const amount = durationHours * 25; // $25/hour rate

      // Create payment
      await this.externalService.createPayment(booking.id, amount);

      // Send notification
      await this.externalService.sendNotification(
        booking.userId,
        booking.id,
        `Your booking for workspace ${booking.workspaceId} has been created successfully!`,
      );

      // Create report entry
      await this.externalService.createReport(
        'New Booking Created',
        `Booking ${booking.id} created for user ${booking.userId} in workspace ${booking.workspaceId}`,
      );
    } catch (error) {
      console.error('External service orchestration failed:', error);
    }
  }

  async findById(id: string): Promise<Booking | null> {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async list(query: QueryBookingsDto): Promise<Booking[]> {
    const where: Prisma.BookingWhereInput = {
      userId: query.userId,
      workspaceId: query.workspaceId,
      AND: [],
    };

    const from = this.toDate(query.from);
    const to = this.toDate(query.to);
    if (from) {
      (where.AND as Prisma.BookingWhereInput[]).push({
        endTime: { gte: from },
      });
    }
    if (to) {
      (where.AND as Prisma.BookingWhereInput[]).push({
        startTime: { lte: to },
      });
    }

    return this.prisma.booking.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
  }

  async confirm(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Cannot confirm a cancelled booking');
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });
  }

  async cancel(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'CANCELLED') return booking;
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    const start = dto.startTime ? new Date(dto.startTime) : booking.startTime;
    const end = dto.endTime ? new Date(dto.endTime) : booking.endTime;
    if (!(start < end)) {
      throw new BadRequestException('startTime must be before endTime');
    }

    // If time/window changed, ensure no overlap against others
    if (dto.startTime || dto.endTime) {
      const overlapping = await this.prisma.booking.findFirst({
        where: this.buildTimeOverlapWhere(booking.workspaceId, start, end, id),
      });
      if (overlapping) {
        throw new BadRequestException(
          'Time slot overlaps with an existing booking',
        );
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        startTime: start,
        endTime: end,
        status: dto.status ?? booking.status,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.booking.delete({ where: { id } });
  }
}
