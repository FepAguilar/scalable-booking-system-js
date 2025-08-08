import { Test, TestingModule } from "@nestjs/testing";
import { ReportingController } from "./reporting.controller";
import { ReportingService } from "./reporting.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { Report } from "@prisma/client";

describe("ReportingController", () => {
  let controller: ReportingController;

  const mockReport: Report = {
    id: "1",
    title: "Monthly Summary",
    description: "Summary for July",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockReport),
    findAll: jest.fn().mockResolvedValue([mockReport]),
  } as Partial<Record<keyof ReportingService, jest.Mock>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportingController],
      providers: [
        {
          provide: ReportingService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ReportingController>(ReportingController);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("create() should call service and return report", async () => {
    const dto: CreateReportDto = {
      title: "Monthly Summary",
      description: "Summary for July",
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockReport);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it("findAll() should return list", async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockReport]);
    expect(mockService.findAll).toHaveBeenCalled();
  });
});
