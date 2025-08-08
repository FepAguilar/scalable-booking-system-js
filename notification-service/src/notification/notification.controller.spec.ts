import { Test, TestingModule } from "@nestjs/testing";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { Notification } from "@prisma/client";

describe("NotificationController", () => {
  let controller: NotificationController;

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

  const mockService = {
    create: jest.fn().mockResolvedValue(mockNotification),
    findAll: jest.fn().mockResolvedValue([mockNotification]),
  } as Partial<Record<keyof NotificationService, jest.Mock>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("create() should delegate and return notification", async () => {
    const dto: CreateNotificationDto = {
      userId: "u-1",
      bookingId: "b-1",
      type: "EMAIL",
      message: "Your booking is confirmed",
      status: "SENT",
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockNotification);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it("findAll() should return list", async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockNotification]);
    expect(mockService.findAll).toHaveBeenCalled();
  });
});
