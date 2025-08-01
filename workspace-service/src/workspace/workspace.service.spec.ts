import { WorkspaceService } from './workspace.service';
import { PrismaClient, Workspace } from '@prisma/client';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let prisma: PrismaClient;

  const mockWorkspace: Workspace = {
    id: '1',
    name: 'Main Office',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ✅ Separate mock object for workspace delegate to avoid unbound-method errors
  const mockWorkspaceDelegate = {
    create: jest.fn().mockResolvedValue(mockWorkspace),
    findMany: jest.fn().mockResolvedValue([mockWorkspace]),
  };

  beforeEach(() => {
    prisma = {
      workspace: mockWorkspaceDelegate,
    } as unknown as PrismaClient;

    service = new WorkspaceService(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call prisma.workspace.create with the DTO and return a workspace', async () => {
      const dto: CreateWorkspaceDto = { name: 'Main Office' };

      const result = await service.create(dto);

      expect(mockWorkspaceDelegate.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockWorkspace);
    });
  });

  describe('findAll', () => {
    it('should call prisma.workspace.findMany and return all workspaces', async () => {
      const result = await service.findAll();

      expect(mockWorkspaceDelegate.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockWorkspace]);
    });
  });
});
