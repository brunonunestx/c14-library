import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksService {
  constructor(private readonly repository: BooksRepository) {}

  findAll(): Promise<Book[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.repository.findById(id);
    if (!book) throw new NotFoundException(`Book not found: ${id}`);
    return book;
  }

  async create(data: Prisma.BookCreateInput): Promise<Book> {
    const existing = await this.repository.findByIsbn(data.isbn);
    if (existing) throw new ConflictException(`ISBN already registered: ${data.isbn}`);
    return this.repository.create(data);
  }

  async update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
    await this.findById(id);
    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }
}
