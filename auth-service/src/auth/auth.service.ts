import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  register(dto: RegisterDto): AuthResponse {
    // TODO: Hash password, check if user exists, save to DB via Prisma
    return {
      accessToken: 'mock-token',
      user: {
        email: dto.email,
        fullName: dto.fullName,
      },
    };
  }
}
