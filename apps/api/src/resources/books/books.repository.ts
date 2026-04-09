import { Injectable } from '@nestjs/common';
import { Book, Prisma } from '@prisma/client';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Book[]> {
    return this.prisma.book.findMany();
  }

  findById(id: string): Promise<Book | null> {
    return this.prisma.book.findUnique({ where: { id } });
  }

  findByIsbn(isbn: string): Promise<Book | null> {
    return this.prisma.book.findUnique({ where: { isbn } });
  }

  create(data: Prisma.BookCreateInput): Promise<Book> {
    return this.prisma.book.create({ data });
  }

  update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
    return this.prisma.book.update({ where: { id }, data });
  }

  delete(id: string): Promise<Book> {
    return this.prisma.book.delete({ where: { id } });
  }
}
