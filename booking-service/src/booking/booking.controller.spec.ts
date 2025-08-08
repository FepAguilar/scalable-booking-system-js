import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '@prisma/client';

describe('BookingController', () => {
  let controller: BookingController;

  const mockBooking: Booking = {
    id: '1',
    userId: 'user-1',
    workspaceId: 'ws-1',
    startTime: new Date('2025-01-01T09:00:00.000Z'),
    endTime: new Date('2025-01-01T10:00:00.000Z'),
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookingService = {
    create: jest.fn().mockResolvedValue(mockBooking),
    findById: jest.fn().mockResolvedValue(mockBooking),
  } as Partial<Record<keyof BookingService, jest.Mock>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call service.create and return a Booking', async () => {
      const dto: CreateBookingDto = {
        userId: 'user-1',
        workspaceId: 'ws-1',
        startTime: '2025-01-01T09:00:00.000Z',
        endTime: '2025-01-01T10:00:00.000Z',
        status: 'PENDING',
      };

      const result = await controller.create(dto);

      expect(result).toEqual(mockBooking);
      expect(mockBookingService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById()', () => {
    it('should call service.findById and return a Booking', async () => {
      const id = '1';
      const result = await controller.findById(id);

      expect(result).toEqual(mockBooking);
      expect(mockBookingService.findById).toHaveBeenCalledWith(id);
    });
  });
});
