import { PrismaClient, Notification } from "@prisma/client";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

describe("NotificationService", () => {
  let service: NotificationService;
  let prisma: PrismaClient;

  const mockNotification: Notification = {
    id: "1",
    userId: "u-1",
    bookingId: "b-1",
    type: "EMAIL",
    message: "Your booking is confirmed",
    status: "SENT",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDelegate = {
    create: jest.fn().mockResolvedValue(mockNotification),
    findMany: jest.fn().mockResolvedValue([mockNotification]),
  };

  beforeEach(() => {
    prisma = {
      notification: mockDelegate,
    } as unknown as PrismaClient;

    service = new NotificationService(prisma);
  });

  afterEach(() => jest.clearAllMocks());

  it("create() should call prisma.notification.create and return entity", async () => {
    const dto: CreateNotificationDto = {
      userId: "u-1",
      bookingId: "b-1",
      type: "EMAIL",
      message: "Your booking is confirmed",
      status: "SENT",
    };

    const result = await service.create(dto);

    expect(mockDelegate.create).toHaveBeenCalledWith({
      data: {
        userId: dto.userId,
        bookingId: dto.bookingId,
        type: dto.type,
        message: dto.message,
        status: dto.status,
      },
    });
    expect(result).toEqual(mockNotification);
  });

  it("findAll() should call prisma.notification.findMany and return list", async () => {
    const result = await service.findAll();
    expect(mockDelegate.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockNotification]);
  });
});
