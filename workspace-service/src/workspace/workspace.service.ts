import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Workspace } from '@prisma/client';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ExternalService } from '../services/external.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly externalService: ExternalService,
  ) {}

  async create(dto: CreateWorkspaceDto): Promise<Workspace> {
    const workspace = await this.prisma.workspace.create({ data: dto });

    // Orchestrate external services (non-blocking)
    this.orchestrateExternalServices(workspace).catch((error) => {
      console.error('Failed to orchestrate external services:', error);
    });

    return workspace;
  }

  private async orchestrateExternalServices(
    workspace: Workspace,
  ): Promise<void> {
    try {
      // Send workspace creation notification
      await this.externalService.sendWorkspaceNotification(
        workspace.id,
        `New workspace "${workspace.name}" has been created and is now available for bookings.`,
      );

      // Create workspace report
      await this.externalService.createWorkspaceReport(
        'New Workspace Created',
        `Workspace "${workspace.name}" (${workspace.id}) created successfully`,
      );
    } catch (error) {
      console.error('External service orchestration failed:', error);
    }
  }

  async findAll(): Promise<Workspace[]> {
    return this.prisma.workspace.findMany();
  }

  async findById(id: string): Promise<Workspace> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async findByIdWithBookings(id: string): Promise<any> {
    const workspace = await this.findById(id);
    const bookings = await this.externalService.getWorkspaceBookings(id);

    return {
      ...workspace,
      bookings,
    };
  }

  async update(
    id: string,
    dto: Partial<CreateWorkspaceDto>,
  ): Promise<Workspace> {
    const workspace = await this.findById(id);

    const updatedWorkspace = await this.prisma.workspace.update({
      where: { id },
      data: dto,
    });

    // Send update notification
    this.externalService
      .sendWorkspaceNotification(
        workspace.id,
        `Workspace "${workspace.name}" has been updated.`,
      )
      .catch((error) => {
        console.error('Failed to send update notification:', error);
      });

    return updatedWorkspace;
  }

  async delete(id: string): Promise<void> {
    const workspace = await this.findById(id);

    await this.prisma.workspace.delete({
      where: { id },
    });

    // Send deletion notification
    this.externalService
      .sendWorkspaceNotification(
        workspace.id,
        `Workspace "${workspace.name}" has been removed from the system.`,
      )
      .catch((error) => {
        console.error('Failed to send deletion notification:', error);
      });
  }
}
