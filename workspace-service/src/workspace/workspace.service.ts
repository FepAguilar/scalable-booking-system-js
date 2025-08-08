import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient, Workspace } from "@prisma/client";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateWorkspaceDto): Promise<Workspace> {
    return this.prisma.workspace.create({ data: dto });
  }

  async findAll(): Promise<Workspace[]> {
    return this.prisma.workspace.findMany();
  }

  async findById(id: string): Promise<Workspace> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });
    
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }
    
    return workspace;
  }
}
