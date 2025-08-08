import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ExternalService } from '../services/external.service';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    ExternalService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class PaymentModule {}