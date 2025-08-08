import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class NotificationModule {}
