import { Injectable } from "@nestjs/common";
import { PrismaClient, Admin } from "@prisma/client";
import { CreateAdminDto } from "./dto/create-admin.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    return this.prisma.admin.create({
      data: {
        name: dto.name,
        email: dto.email,
      },
    });
  }

  async findAll(): Promise<Admin[]> {
    return this.prisma.admin.findMany({ orderBy: { createdAt: "desc" } });
  }
}
