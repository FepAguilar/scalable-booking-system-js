import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [BookingController],
  providers: [
    BookingService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class BookingModule {}