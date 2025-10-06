import { prisma } from "../database/prisma";

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class PrismaRepository<T extends BaseEntity> {
  protected abstract model: any;

  async findAll(): Promise<T[]> {
    return await this.model.findMany();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt">>
  ): Promise<T | null> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findWhere(where: any): Promise<T[]> {
    return await this.model.findMany({
      where,
    });
  }

  async findFirst(where: any): Promise<T | null> {
    return await this.model.findFirst({
      where,
    });
  }

  async count(where?: any): Promise<number> {
    return await this.model.count({
      where,
    });
  }
}
