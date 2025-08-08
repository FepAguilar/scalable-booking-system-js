import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ReportingService } from "./reporting.service";
import { ReportingController } from "./reporting.controller";

@Module({
  controllers: [ReportingController],
  providers: [
    ReportingService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class ReportingModule {}