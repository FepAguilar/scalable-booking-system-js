import { Controller, Post, Body, Get } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBody,
} from "@nestjs/swagger";
import { ReportingService } from "./reporting.service";
import { CreateReportDto } from "./dto/create-report.dto";

@ApiTags("Reports")
@Controller("reports")
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post()
  @ApiOperation({ summary: "Create a new report" })
  @ApiCreatedResponse({ description: "Report created successfully" })
  @ApiBody({ type: CreateReportDto })
  create(@Body() dto: CreateReportDto) {
    return this.reportingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all reports" })
  @ApiResponse({ status: 200, description: "List of reports" })
  findAll() {
    return this.reportingService.findAll();
  }
}