import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call userService.create with the correct DTO', async () => {
      const dto: CreateUserDto = {
        email: 'john@example.com',
        fullName: 'John Doe',
        role: 'MEMBER',
      };

      const createdUser = {
        id: 'user-123',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.create!.mockResolvedValue(createdUser);

      const result = await controller.create(dto);
      expect(result).toEqual(createdUser);
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('should call userService.findById with the correct ID', async () => {
      const id = 'user-123';
      const fakeUser = {
        id,
        email: 'john@example.com',
        fullName: 'John Doe',
        role: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.findById!.mockResolvedValue(fakeUser);

      const result = await controller.findById(id);
      expect(result).toEqual(fakeUser);
      expect(mockUserService.findById).toHaveBeenCalledWith(id);
    });
  });
});
