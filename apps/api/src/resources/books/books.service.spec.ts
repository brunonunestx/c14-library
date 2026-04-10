import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { mockDeep, PrismaMock, prismaMockProvider } from '../../test/prisma.mock';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';

const bookFixture = {
  id: 'book-1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  isbn: '9780132350884',
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module = await Test.createTestingModule({
      providers: [BooksService, BooksRepository, prismaMockProvider(prisma)],
    }).compile();

    service = module.get(BooksService);
  });

  // ── Fluxo ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('[fluxo] should return all books', async () => {
      prisma.book.findMany.mockResolvedValue([bookFixture]);

      const result = await service.findAll();

      expect(result).toEqual([bookFixture]);
      expect(prisma.book.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('[fluxo] should return a book when it exists', async () => {
      prisma.book.findUnique.mockResolvedValue(bookFixture);

      const result = await service.findById('book-1');

      expect(result).toEqual(bookFixture);
    });
  });

  describe('create', () => {
    it('[fluxo] should create a book when ISBN is not taken', async () => {
      prisma.book.findUnique.mockResolvedValue(null);
      prisma.book.create.mockResolvedValue(bookFixture);

      const result = await service.create({
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        quantity: 2,
      });

      expect(result).toEqual(bookFixture);
      expect(prisma.book.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('[fluxo] should update a book when it exists', async () => {
      const updated = { ...bookFixture, title: 'Clean Code 2nd Edition' };
      prisma.book.findUnique.mockResolvedValue(bookFixture);
      prisma.book.update.mockResolvedValue(updated);

      const result = await service.update('book-1', { title: 'Clean Code 2nd Edition' });

      expect(result.title).toBe('Clean Code 2nd Edition');
    });
  });

  describe('remove', () => {
    it('[fluxo] should delete a book when it exists', async () => {
      prisma.book.findUnique.mockResolvedValue(bookFixture);
      prisma.book.delete.mockResolvedValue(bookFixture);

      await expect(service.remove('book-1')).resolves.toBeUndefined();
      expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: 'book-1' } });
    });
  });

  // ── Inoportunos ──────────────────────────────────────────────────────────

  describe('findAll [inoportunos]', () => {
    it('should return empty array when no books exist', async () => {
      prisma.book.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById [inoportunos]', () => {
    it('should throw NotFoundException when book does not exist', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(NotFoundException);
    });

    it('should include the id in the error message', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow('missing-id');
    });
  });

  describe('create [inoportunos]', () => {
    it('should throw ConflictException when ISBN is already registered', async () => {
      prisma.book.findUnique.mockResolvedValue(bookFixture);

      await expect(
        service.create({ title: 'Outro', author: 'Autor', isbn: '9780132350884' }),
      ).rejects.toThrow(ConflictException);

      expect(prisma.book.create).not.toHaveBeenCalled();
    });

    it('should not call create when ISBN check fails', async () => {
      prisma.book.findUnique.mockResolvedValue(bookFixture);

      await expect(
        service.create({ title: 'X', author: 'Y', isbn: '9780132350884' }),
      ).rejects.toThrow();

      expect(prisma.book.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('update [inoportunos]', () => {
    it('should throw NotFoundException when book does not exist', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { title: 'X' })).rejects.toThrow(NotFoundException);
    });

    it('should not call update when book is not found', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { title: 'X' })).rejects.toThrow();

      expect(prisma.book.update).not.toHaveBeenCalled();
    });
  });

  describe('remove [inoportunos]', () => {
    it('should throw NotFoundException when book does not exist', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });

    it('should not call delete when book is not found', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow();

      expect(prisma.book.delete).not.toHaveBeenCalled();
    });
  });
});
