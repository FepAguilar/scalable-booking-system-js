import { Injectable } from "@nestjs/common";
import { PrismaClient, Report } from "@prisma/client";
import { CreateReportDto } from "./dto/create-report.dto";

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateReportDto): Promise<Report> {
    return this.prisma.report.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
      },
    });
  }

  async findAll(): Promise<Report[]> {
    return this.prisma.report.findMany({ orderBy: { createdAt: "desc" } });
  }
}
