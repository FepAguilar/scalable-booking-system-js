// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ExternalService } from '../services/external.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly externalService: ExternalService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: dto,
    });

    // Orchestrate external services (non-blocking)
    this.orchestrateExternalServices(user).catch((error) => {
      console.error('Failed to orchestrate external services:', error);
    });

    return user;
  }

  private async orchestrateExternalServices(user: User): Promise<void> {
    try {
      // Send welcome notification
      await this.externalService.sendUserNotification(
        user.id,
        `Welcome ${user.name}! Your account has been created successfully.`,
      );

      // Create user report
      await this.externalService.createUserReport(
        'New User Registration',
        `User ${user.name} (${user.email}) registered successfully`,
      );
    } catch (error) {
      console.error('External service orchestration failed:', error);
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByIdWithBookings(id: string): Promise<any> {
    const user = await this.findById(id);
    const bookings = await this.externalService.getUserBookings(id);

    return {
      ...user,
      bookings,
    };
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async update(id: string, dto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findById(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    // Send update notification
    this.externalService
      .sendUserNotification(
        user.id,
        `Your profile has been updated successfully.`,
      )
      .catch((error) => {
        console.error('Failed to send update notification:', error);
      });

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);

    await this.prisma.user.delete({
      where: { id },
    });

    // Send deletion notification
    this.externalService
      .sendUserNotification(
        user.id,
        `Your account has been deleted. We're sorry to see you go!`,
      )
      .catch((error) => {
        console.error('Failed to send deletion notification:', error);
      });
  }
}
