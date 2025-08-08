import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { SERVICES_CONFIG } from '../config/services.config';

@Injectable()
export class ExternalService {
  private readonly logger = new Logger(ExternalService.name);
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: 5000,
    });
  }

  async getBooking(bookingId: string): Promise<any> {
    try {
      const response = await this.httpClient.get(
        `${SERVICES_CONFIG.booking.baseUrl}${SERVICES_CONFIG.booking.endpoints.findById}/${bookingId}`,
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get booking ${bookingId}:`, errorMessage);
      return null;
    }
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<any> {
    try {
      const response = await this.httpClient.patch(
        `${SERVICES_CONFIG.booking.baseUrl}${SERVICES_CONFIG.booking.endpoints.updateStatus}/${bookingId}`,
        { status },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to update booking status ${bookingId}:`,
        errorMessage,
      );
      return null;
    }
  }

  async sendPaymentNotification(
    bookingId: string,
    amount: number,
    status: string,
  ): Promise<any> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.notification.baseUrl}${SERVICES_CONFIG.notification.endpoints.create}`,
        {
          bookingId,
          type: 'PAYMENT',
          message: `Payment ${status.toLowerCase()} for booking ${bookingId} - Amount: $${amount}`,
          status: 'PENDING',
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send payment notification:`, errorMessage);
      return null;
    }
  }

  async createPaymentReport(
    bookingId: string,
    amount: number,
    status: string,
  ): Promise<any> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.reporting.baseUrl}${SERVICES_CONFIG.reporting.endpoints.create}`,
        {
          title: `Payment ${status}`,
          description: `Payment ${status.toLowerCase()} for booking ${bookingId} - Amount: $${amount}`,
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create payment report:`, errorMessage);
      return null;
    }
  }
} 