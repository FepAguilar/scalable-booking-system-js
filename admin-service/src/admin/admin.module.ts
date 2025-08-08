import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    { provide: PrismaClient, useValue: new PrismaClient() },
  ],
})
export class AdminModule {} 