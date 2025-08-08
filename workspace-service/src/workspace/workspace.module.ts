import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { ExternalService } from '../services/external.service';

@Module({
  imports: [ConfigModule],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    ExternalService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class WorkspaceModule {}
