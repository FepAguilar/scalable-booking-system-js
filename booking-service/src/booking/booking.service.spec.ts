import { Booking, PrismaClient } from '@prisma/client';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingService', () => {
  let service: BookingService;
  let prisma: PrismaClient;

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

  const mockBookingDelegate = {
    create: jest.fn().mockResolvedValue(mockBooking),
    findUnique: jest.fn().mockResolvedValue(mockBooking),
    findFirst: jest.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    prisma = {
      booking: mockBookingDelegate,
    } as unknown as PrismaClient;

    service = new BookingService(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call prisma.booking.create with mapped DTO and return a booking', async () => {
      const dto: CreateBookingDto = {
        userId: 'user-1',
        workspaceId: 'ws-1',
        startTime: '2025-01-01T09:00:00.000Z',
        endTime: '2025-01-01T10:00:00.000Z',
        status: 'PENDING',
      };

      const result = await service.create(dto);

      expect(mockBookingDelegate.findFirst).toHaveBeenCalled();
      expect(mockBookingDelegate.create).toHaveBeenCalledWith({
        data: {
          userId: dto.userId,
          workspaceId: dto.workspaceId,
          startTime: new Date(dto.startTime),
          endTime: new Date(dto.endTime),
          status: dto.status,
        },
      });

      expect(result).toEqual(mockBooking);
    });
  });

  describe('findById', () => {
    it('should call prisma.booking.findUnique and return the booking', async () => {
      const id = '1';

      const result = await service.findById(id);

      expect(mockBookingDelegate.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockBooking);
    });
  });
});