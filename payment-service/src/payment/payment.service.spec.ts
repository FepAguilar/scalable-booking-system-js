import { Payment, PrismaClient } from '@prisma/client';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let prisma: PrismaClient;

  const mockPayment: Payment = {
    id: '1',
    bookingId: 'b-1',
    amount: 100,
    currency: 'USD',
    status: 'PAID',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaymentDelegate = {
    create: jest.fn().mockResolvedValue(mockPayment),
    findMany: jest.fn().mockResolvedValue([mockPayment]),
  };

  beforeEach(() => {
    prisma = {
      payment: mockPaymentDelegate,
    } as unknown as PrismaClient;

    service = new PaymentService(prisma);
  });

  afterEach(() => jest.clearAllMocks());

  it('create() should call prisma.payment.create and return payment', async () => {
    const dto: CreatePaymentDto = {
      bookingId: 'b-1',
      amount: 100,
      currency: 'USD',
      status: 'PAID',
    };

    const result = await service.create(dto);

    expect(mockPaymentDelegate.create).toHaveBeenCalledWith({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        currency: dto.currency,
        status: dto.status,
      },
    });
    expect(result).toEqual(mockPayment);
  });

  it('findAll() should call prisma.payment.findMany and return list', async () => {
    const result = await service.findAll();
    expect(mockPaymentDelegate.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockPayment]);
  });
});