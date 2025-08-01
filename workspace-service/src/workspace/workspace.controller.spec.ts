import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Workspace } from '@prisma/client';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;

  const mockWorkspace: Workspace = {
    id: '1',
    name: 'Main Office',
    description: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockWorkspaceService = {
    create: jest.fn().mockResolvedValue(mockWorkspace),
    findAll: jest.fn().mockResolvedValue([mockWorkspace]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: mockWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call service.create and return a Workspace', async () => {
      const dto: CreateWorkspaceDto = { name: 'Main Office' };
      const result = await controller.create(dto);
      expect(result).toEqual(mockWorkspace);
      expect(mockWorkspaceService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll()', () => {
    it('should call service.findAll and return an array of Workspaces', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockWorkspace]);
      expect(mockWorkspaceService.findAll).toHaveBeenCalled();
    });
  });
});
