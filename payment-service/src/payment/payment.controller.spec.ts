import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from '@prisma/client';

describe('PaymentController', () => {
  let controller: PaymentController;

  const mockPayment: Payment = {
    id: '1',
    bookingId: 'b-1',
    amount: 100,
    currency: 'USD',
    status: 'PAID',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockPayment),
    findAll: jest.fn().mockResolvedValue([mockPayment]),
  } as Partial<Record<keyof PaymentService, jest.Mock>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create() should delegate to service and return payment', async () => {
    const dto: CreatePaymentDto = {
      bookingId: 'b-1',
      amount: 100,
      currency: 'USD',
      status: 'PAID',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockPayment);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('findAll() should return payments', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockPayment]);
    expect(mockService.findAll).toHaveBeenCalled();
  });
});