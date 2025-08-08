import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingService } from './booking.service';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiCreatedResponse({
    description: 'The booking has been successfully created.',
  })
  @ApiBody({ type: CreateBookingDto })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List bookings with optional filters' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  list(@Query() query: QueryBookingsDto) {
    return this.bookingService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking found' })
  findById(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update (reschedule) a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated' })
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(id, dto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed' })
  confirm(@Param('id') id: string) {
    return this.bookingService.confirm(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled' })
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({ status: 204, description: 'Booking deleted' })
  async remove(@Param('id') id: string) {
    await this.bookingService.remove(id);
    return { success: true };
  }
}
