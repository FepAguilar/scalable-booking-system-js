import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { Workspace } from "@prisma/client";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiBody,
} from "@nestjs/swagger";

@ApiTags("Workspaces") // Groups endpoints under "Workspaces"
@Controller("workspaces")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @ApiOperation({ summary: "Create a new workspace" })
  @ApiCreatedResponse({
    description: "The workspace has been successfully created.",
  })
  @ApiBody({ type: CreateWorkspaceDto })
  async create(@Body() dto: CreateWorkspaceDto): Promise<Workspace> {
    return this.workspaceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all workspaces" })
  @ApiResponse({
    status: 200,
    description: "List of all workspaces",
  })
  async findAll(): Promise<Workspace[]> {
    return this.workspaceService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get workspace by ID" })
  @ApiResponse({
    status: 200,
    description: "Workspace found",
  })
  @ApiResponse({
    status: 404,
    description: "Workspace not found",
  })
  async findById(@Param("id") id: string): Promise<Workspace> {
    return this.workspaceService.findById(id);
  }
}
