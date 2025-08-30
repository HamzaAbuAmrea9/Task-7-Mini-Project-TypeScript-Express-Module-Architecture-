export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}


import { randomUUID } from 'crypto'; 

export class GenericRepository<T extends BaseEntity> {
 
  protected readonly items: T[] = [];

  // Find all items
  findAll(): T[] {
    return this.items;
  }

  // Find an item by its ID
  findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  // Create a new item
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const newItem = {
      id: randomUUID(), // Generate a unique ID
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T;

    this.items.push(newItem);
    return newItem;
  }

  // Update an existing item by its ID
  update(id: string, item: Partial<Omit<T, 'id' | 'createdAt'>>): T | undefined {
    const itemIndex = this.items.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return undefined; // Item not found
    }

    const existingItem = this.items[itemIndex];

    const updatedItem = {
      ...existingItem,
      ...item,
      updatedAt: new Date(),
    } as T;

    this.items[itemIndex] = updatedItem;
    return updatedItem;
  }

  // Delete an item by its ID
  delete(id: string): boolean {
    const itemIndex = this.items.findIndex(i => i.id === id);

    if (itemIndex === -1) {
      return false; 
    }

    this.items.splice(itemIndex, 1); 
    return true;
  }
}