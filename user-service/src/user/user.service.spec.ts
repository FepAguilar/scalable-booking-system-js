// src/user/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaClient, User } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let prismaMock: {
    user: {
      create: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaClient,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'MEMBER',
      };

      const mockUser: User = {
        id: 'user-abc123',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(prismaMock.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toMatchObject({
        email: dto.email,
        fullName: dto.fullName,
        role: dto.role,
      });
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const id = 'user-abc123';
      const mockUser: User = {
        id,
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById(id);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toMatchObject({
        id,
        email: mockUser.email,
        fullName: mockUser.fullName,
      });
    });

    it('should return null if user is not found', async () => {
      const id = 'nonexistent-user-id';
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await service.findById(id);

      expect(result).toBeNull();
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
