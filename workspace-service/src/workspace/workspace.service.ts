import { Injectable } from '@nestjs/common';
import { PrismaClient, Workspace } from '@prisma/client';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateWorkspaceDto): Promise<Workspace> {
    return this.prisma.workspace.create({ data: dto });
  }

  async findAll(): Promise<Workspace[]> {
    return this.prisma.workspace.findMany();
  }
}
