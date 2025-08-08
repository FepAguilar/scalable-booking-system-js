import { PrismaClient, Admin } from "@prisma/client";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";

describe("AdminService", () => {
  let service: AdminService;
  let prisma: PrismaClient;

  const mockAdmin: Admin = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDelegate = {
    create: jest.fn().mockResolvedValue(mockAdmin),
    findMany: jest.fn().mockResolvedValue([mockAdmin]),
  };

  beforeEach(() => {
    prisma = {
      admin: mockDelegate,
    } as unknown as PrismaClient;

    service = new AdminService(prisma);
  });

  afterEach(() => jest.clearAllMocks());

  it("create() should call prisma.admin.create and return the entity", async () => {
    const dto: CreateAdminDto = {
      name: "John Doe",
      email: "john@example.com",
    };
    const result = await service.create(dto);

    expect(mockDelegate.create).toHaveBeenCalledWith({
      data: {
        name: dto.name,
        email: dto.email,
      },
    });
    expect(result).toEqual(mockAdmin);
  });

  it("findAll() should call prisma.admin.findMany and return list", async () => {
    const result = await service.findAll();
    expect(mockDelegate.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockAdmin]);
  });
});
