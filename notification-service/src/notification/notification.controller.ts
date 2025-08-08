import { Controller, Post, Body, Get } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBody,
} from "@nestjs/swagger";
import { NotificationService } from "./notification.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: "Create a new notification" })
  @ApiCreatedResponse({ description: "Notification created successfully" })
  @ApiBody({ type: CreateNotificationDto })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List all notifications" })
  @ApiResponse({ status: 200, description: "List of notifications" })
  findAll() {
    return this.notificationService.findAll();
  }
}
