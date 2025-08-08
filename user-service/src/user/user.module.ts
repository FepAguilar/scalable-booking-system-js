// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ExternalService } from '../services/external.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [
    UserService,
    ExternalService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class UserModule {}
