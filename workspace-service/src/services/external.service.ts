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

  async getWorkspaceBookings(workspaceId: string): Promise<any[]> {
    try {
      const response = await this.httpClient.get(
        `${SERVICES_CONFIG.booking.baseUrl}${SERVICES_CONFIG.booking.endpoints.findByWorkspaceId}?workspaceId=${workspaceId}`,
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get workspace bookings:`, errorMessage);
      return [];
    }
  }

  async sendWorkspaceNotification(
    workspaceId: string,
    message: string,
  ): Promise<any> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.notification.baseUrl}${SERVICES_CONFIG.notification.endpoints.create}`,
        {
          workspaceId,
          type: 'EMAIL',
          message,
          status: 'PENDING',
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to send workspace notification:`, errorMessage);
      return null;
    }
  }

  async createWorkspaceReport(title: string, description: string): Promise<any> {
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
      this.logger.error(`Failed to create workspace report:`, errorMessage);
      return null;
    }
  }
} 