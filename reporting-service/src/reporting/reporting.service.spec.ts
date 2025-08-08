import { PrismaClient, Report } from "@prisma/client";
import { ReportingService } from "./reporting.service";
import { CreateReportDto } from "./dto/create-report.dto";

describe("ReportingService", () => {
  let service: ReportingService;
  let prisma: PrismaClient;

  const mockReport: Report = {
    id: "1",
    title: "Monthly Summary",
    description: "Summary for July",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDelegate = {
    create: jest.fn().mockResolvedValue(mockReport),
    findMany: jest.fn().mockResolvedValue([mockReport]),
  };

  beforeEach(() => {
    prisma = {
      report: mockDelegate,
    } as unknown as PrismaClient;

    service = new ReportingService(prisma);
  });

  afterEach(() => jest.clearAllMocks());

  it("create() should call prisma.report.create and return the entity", async () => {
    const dto: CreateReportDto = {
      title: "Monthly Summary",
      description: "Summary for July",
    };
    const result = await service.create(dto);

    expect(mockDelegate.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description ?? null,
      },
    });
    expect(result).toEqual(mockReport);
  });

  it("findAll() should call prisma.report.findMany and return list", async () => {
    const result = await service.findAll();
    expect(mockDelegate.findMany).toHaveBeenCalled();
    expect(result).toEqual([mockReport]);
  });
});
