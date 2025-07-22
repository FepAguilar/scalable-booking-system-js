import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Explicitly mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should register a new user and return accessToken + user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      };

      // Cast as mocked functions to use mockResolvedValue
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: dto.email,
        fullName: dto.fullName,
        password: 'hashedPassword',
      });
      (jwtService.signAsync as jest.Mock).mockResolvedValue('mocked-jwt-token');

      const result = await service.register(dto);

      expect(result).toEqual({
        accessToken: 'mocked-jwt-token',
        user: {
          email: dto.email,
          fullName: dto.fullName,
        },
      });
    });

    it('should throw if email is already registered', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
          fullName: 'Jane Doe',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return accessToken and user if credentials are valid', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: dto.email,
        fullName: 'John Doe',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('mocked-jwt-token');

      const result = await service.login(dto);

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.fullName).toBe('John Doe');
    });

    it('should throw if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ email: 'no-user@example.com', password: 'password123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        fullName: 'John Doe',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
