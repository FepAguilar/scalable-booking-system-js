import { Injectable } from '@nestjs/common';
import { PrismaClient, Payment } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ExternalService } from '../services/external.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly externalService: ExternalService,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    // Validate booking exists
    const booking = await this.externalService.getBooking(dto.bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const payment = await this.prisma.payment.create({
      data: dto,
    });

    // Orchestrate external services (non-blocking)
    this.orchestrateExternalServices(payment).catch((error) => {
      console.error('Failed to orchestrate external services:', error);
    });

    return payment;
  }

  private async orchestrateExternalServices(payment: Payment): Promise<void> {
    try {
      // Send payment notification
      await this.externalService.sendPaymentNotification(
        payment.bookingId,
        payment.amount,
        payment.status,
      );

      // Create payment report
      await this.externalService.createPaymentReport(
        payment.bookingId,
        payment.amount,
        payment.status,
      );

      // Update booking status if payment is successful
      if (payment.status === 'COMPLETED') {
        await this.externalService.updateBookingStatus(
          payment.bookingId,
          'CONFIRMED',
        );
      }
    } catch (error) {
      console.error('External service orchestration failed:', error);
    }
  }

  async findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany();
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }

  async findByBookingId(bookingId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { bookingId },
    });
  }

  async updateStatus(id: string, status: string): Promise<Payment> {
    const payment = await this.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: { status },
    });

    // Orchestrate status change
    this.orchestrateExternalServices(updatedPayment).catch((error) => {
      console.error('Failed to orchestrate status change:', error);
    });

    return updatedPayment;
  }
}