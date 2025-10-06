import { prisma } from "../database/prisma";

// Base interface for entities (matches Prisma's generated types)
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generic Prisma Repository
export abstract class PrismaRepository<T extends BaseEntity> {
  protected abstract model: any; // Prisma model delegate

  // Find all items
  async findAll(): Promise<T[]> {
    return await this.model.findMany();
  }

  // Find an item by its ID
  async findById(id: string): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }

  // Create a new item
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    return await this.model.create({
      data,
    });
  }

  // Update an existing item by its ID
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
      // If record not found, return null
      return null;
    }
  }

  // Delete an item by its ID
  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // If record not found, return false
      return false;
    }
  }

  // Find items with custom conditions
  async findWhere(where: any): Promise<T[]> {
    return await this.model.findMany({
      where,
    });
  }

  // Find first item matching conditions
  async findFirst(where: any): Promise<T | null> {
    return await this.model.findFirst({
      where,
    });
  }

  // Count items
  async count(where?: any): Promise<number> {
    return await this.model.count({
      where,
    });
  }
}
