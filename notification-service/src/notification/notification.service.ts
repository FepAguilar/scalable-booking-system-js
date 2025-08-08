import { Injectable } from "@nestjs/common";
import { Notification, PrismaClient } from "@prisma/client";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        bookingId: dto.bookingId,
        type: dto.type,
        message: dto.message,
        status: dto.status,
      },
    });
  }

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
