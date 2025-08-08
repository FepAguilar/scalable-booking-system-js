import { Injectable } from '@nestjs/common';
import { Payment, PrismaClient } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        currency: dto.currency,
        status: dto.status,
      },
    });
  }

  async findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany({ orderBy: { createdAt: 'desc' } });
  }
}