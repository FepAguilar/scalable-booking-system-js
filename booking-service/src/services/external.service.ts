import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { SERVICES_CONFIG } from "../config/services.config";

@Injectable()
export class ExternalService {
  private readonly logger = new Logger(ExternalService.name);
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: 5000,
    });
  }

  async validateUser(userId: string): Promise<boolean> {
    try {
      const response = await this.httpClient.get(
        `${SERVICES_CONFIG.user.baseUrl}${SERVICES_CONFIG.user.endpoints.findById}/${userId}`,
      );
      return response.status === 200;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Failed to validate user ${userId}:`, errorMessage);
      throw new HttpException(
        "User not found or service unavailable",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateWorkspace(workspaceId: string): Promise<boolean> {
    try {
      const response = await this.httpClient.get(
        `${SERVICES_CONFIG.workspace.baseUrl}${SERVICES_CONFIG.workspace.endpoints.findById}/${workspaceId}`,
      );
      return response.status === 200;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(
        `Failed to validate workspace ${workspaceId}:`,
        errorMessage,
      );
      throw new HttpException(
        "Workspace not found or service unavailable",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPayment(bookingId: string, amount: number): Promise<any> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.payment.baseUrl}${SERVICES_CONFIG.payment.endpoints.create}`,
        {
          bookingId,
          amount,
          currency: "USD",
          status: "PENDING",
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(
        `Failed to create payment for booking ${bookingId}:`,
        errorMessage,
      );
      throw new HttpException(
        "Payment service unavailable",
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async sendNotification(
    userId: string,
    bookingId: string,
    message: string,
  ): Promise<any> {
    try {
      const response = await this.httpClient.post(
        `${SERVICES_CONFIG.notification.baseUrl}${SERVICES_CONFIG.notification.endpoints.create}`,
        {
          userId,
          bookingId,
          type: "EMAIL",
          message,
          status: "PENDING",
        },
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(
        `Failed to send notification for booking ${bookingId}:`,
        errorMessage,
      );
      // Don't throw here - notifications are not critical for booking creation
      return null;
    }
  }

  async createReport(title: string, description: string): Promise<any> {
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
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Failed to create report:`, errorMessage);
      // Don't throw here - reporting is not critical for booking creation
      return null;
    }
  }
}
