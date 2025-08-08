import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class PaymentModule {}