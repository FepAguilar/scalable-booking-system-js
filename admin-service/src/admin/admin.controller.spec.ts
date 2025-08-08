import { Test, TestingModule } from "@nestjs/testing";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { Admin } from "@prisma/client";

describe("AdminController", () => {
  let controller: AdminController;

  const mockAdmin: Admin = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockAdmin),
    findAll: jest.fn().mockResolvedValue([mockAdmin]),
  } as Partial<Record<keyof AdminService, jest.Mock>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("create() should call service and return admin", async () => {
    const dto: CreateAdminDto = {
      name: "John Doe",
      email: "john@example.com",
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockAdmin);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it("findAll() should return list", async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockAdmin]);
    expect(mockService.findAll).toHaveBeenCalled();
  });
}); 