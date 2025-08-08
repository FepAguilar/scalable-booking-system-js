import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'List of all payments' })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment found' })
  findById(@Param('id') id: string) {
    return this.paymentService.findById(id);
  }

  @Get('booking/:bookingId')
  @ApiOperation({ summary: 'Get payments by booking ID' })
  @ApiResponse({ status: 200, description: 'Payments for booking found' })
  findByBookingId(@Param('bookingId') bookingId: string) {
    return this.paymentService.findByBookingId(bookingId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment status updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.paymentService.updateStatus(id, body.status);
  }
}