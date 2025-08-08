import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
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

  async validateAuthToken(token: string): Promise<boolean> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.auth.baseUrl}${SERVICES_CONFIG.auth.endpoints.validateToken}`,
        { token },
      );
      return response.status === 200;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to validate auth token:`, errorMessage);
      throw new HttpException(
        'Invalid authentication token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async getUserBookings(userId: string): Promise<any[]> {
    try {
      const response = await this.httpClient.get(
        `${SERVICES_CONFIG.booking.baseUrl}${SERVICES_CONFIG.booking.endpoints.findByUserId}?userId=${userId}`,
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get user bookings:`, errorMessage);
      return [];
    }
  }

  async sendUserNotification(userId: string, message: string): Promise<any> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.notification.baseUrl}${SERVICES_CONFIG.notification.endpoints.create}`,
        {
          userId,
          type: 'EMAIL',
          message,
          status: 'PENDING',
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send user notification:`, errorMessage);
      return null;
    }
  }

  async createUserReport(title: string, description: string): Promise<any> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.reporting.baseUrl}${SERVICES_CONFIG.reporting.endpoints.create}`,
        {
          title,
          description,
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create user report:`, errorMessage);
      return null;
    }
  }
} 