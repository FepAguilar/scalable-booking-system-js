import { Controller, Post, Body, Get } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBody,
} from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";

@ApiTags("Admins")
@Controller("admins")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: "Create a new admin" })
  @ApiCreatedResponse({ description: "Admin created successfully" })
  @ApiBody({ type: CreateAdminDto })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all admins" })
  @ApiResponse({ status: 200, description: "List of admins" })
  findAll() {
    return this.adminService.findAll();
  }
} 