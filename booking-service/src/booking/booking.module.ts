import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { ExternalService } from "../services/external.service";

@Module({
  imports: [ConfigModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    ExternalService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class BookingModule {}
