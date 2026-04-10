import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { vi } from 'vitest';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { LoansRepository } from './loans.repository';
import { LoansService } from './loans.service';

const bookFixture = {
  id: 'book-1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  isbn: '9780132350884',
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const memberFixture = {
  id: 'member-1',
  name: 'João Silva',
  email: 'joao@email.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const loanFixture = {
  id: 'loan-1',
  bookId: 'book-1',
  memberId: 'member-1',
  loanedAt: new Date(),
  dueDate: new Date(),
  returnedAt: null,
  book: bookFixture,
  member: memberFixture,
};

const makeLoansRepositoryMock = () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  countActiveByBookId: vi.fn(),
  create: vi.fn(),
  registerReturn: vi.fn(),
});

const makeBookServiceMock = () => ({ findById: vi.fn() });
const makeMemberServiceMock = () => ({ findById: vi.fn() });

describe('LoansService', () => {
  let service: LoansService;
  let repository: ReturnType<typeof makeLoansRepositoryMock>;
  let booksService: ReturnType<typeof makeBookServiceMock>;
  let membersService: ReturnType<typeof makeMemberServiceMock>;

  beforeEach(async () => {
    repository = makeLoansRepositoryMock();
    booksService = makeBookServiceMock();
    membersService = makeMemberServiceMock();

    const module = await Test.createTestingModule({
      providers: [
        LoansService,
        { provide: LoansRepository, useValue: repository },
        { provide: BooksService, useValue: booksService },
        { provide: MembersService, useValue: membersService },
      ],
    }).compile();

    service = module.get(LoansService);
  });

  // ── Fluxo ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('[fluxo] should return all loans', async () => {
      repository.findAll.mockResolvedValue([loanFixture]);

      const result = await service.findAll();

      expect(result).toEqual([loanFixture]);
    });
  });

  describe('findById', () => {
    it('[fluxo] should return a loan when it exists', async () => {
      repository.findById.mockResolvedValue(loanFixture);

      const result = await service.findById('loan-1');

      expect(result).toEqual(loanFixture);
    });
  });

  describe('create', () => {
    it('[fluxo] should create a loan when copies are available', async () => {
      booksService.findById.mockResolvedValue(bookFixture);
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(1);
      repository.create.mockResolvedValue(loanFixture);

      const result = await service.create({ bookId: 'book-1', memberId: 'member-1' });

      expect(result).toEqual(loanFixture);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });

    it('[fluxo] should use provided dueDate when given', async () => {
      const dueDate = '2026-05-01';
      booksService.findById.mockResolvedValue(bookFixture);
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(0);
      repository.create.mockResolvedValue(loanFixture);

      await service.create({ bookId: 'book-1', memberId: 'member-1', dueDate });

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ dueDate: new Date(dueDate) }),
      );
    });
  });

  describe('registerReturn', () => {
    it('[fluxo] should register return when loan is active', async () => {
      const returned = { ...loanFixture, returnedAt: new Date() };
      repository.findById.mockResolvedValue(loanFixture);
      repository.registerReturn.mockResolvedValue(returned);

      const result = await service.registerReturn('loan-1');

      expect(result.returnedAt).not.toBeNull();
    });
  });

  // ── Inoportunos ──────────────────────────────────────────────────────────

  describe('findAll [inoportunos]', () => {
    it('should return empty array when no loans exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById [inoportunos]', () => {
    it('should throw NotFoundException when loan does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create [inoportunos]', () => {
    it('should throw BadRequestException when no copies are available', async () => {
      booksService.findById.mockResolvedValue(bookFixture); // quantity: 2
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(2); // todos emprestados

      await expect(
        service.create({ bookId: 'book-1', memberId: 'member-1' }),
      ).rejects.toThrow(BadRequestException);

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when book has exactly 1 copy and it is loaned', async () => {
      booksService.findById.mockResolvedValue({ ...bookFixture, quantity: 1 });
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(1);

      await expect(
        service.create({ bookId: 'book-1', memberId: 'member-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should succeed when book has 1 copy and 0 active loans', async () => {
      booksService.findById.mockResolvedValue({ ...bookFixture, quantity: 1 });
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(0);
      repository.create.mockResolvedValue(loanFixture);

      await expect(
        service.create({ bookId: 'book-1', memberId: 'member-1' }),
      ).resolves.toBeDefined();
    });

    it('should throw NotFoundException when book does not exist', async () => {
      booksService.findById.mockRejectedValue(new NotFoundException());
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(0);

      await expect(
        service.create({ bookId: 'missing', memberId: 'member-1' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when member does not exist', async () => {
      booksService.findById.mockResolvedValue(bookFixture);
      membersService.findById.mockRejectedValue(new NotFoundException());
      repository.countActiveByBookId.mockResolvedValue(0);

      await expect(
        service.create({ bookId: 'book-1', memberId: 'missing' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should not call repository.create when book is not found', async () => {
      booksService.findById.mockRejectedValue(new NotFoundException());
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(0);

      await expect(
        service.create({ bookId: 'missing', memberId: 'member-1' }),
      ).rejects.toThrow();

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should use default dueDate of 14 days when not provided', async () => {
      booksService.findById.mockResolvedValue(bookFixture);
      membersService.findById.mockResolvedValue(memberFixture);
      repository.countActiveByBookId.mockResolvedValue(0);
      repository.create.mockResolvedValue(loanFixture);

      const before = Date.now();
      await service.create({ bookId: 'book-1', memberId: 'member-1' });
      const after = Date.now();

      const call = repository.create.mock.calls[0][0];
      const dueDateMs = call.dueDate.getTime();
      const expectedMin = before + 14 * 24 * 60 * 60 * 1000;
      const expectedMax = after + 14 * 24 * 60 * 60 * 1000;

      expect(dueDateMs).toBeGreaterThanOrEqual(expectedMin);
      expect(dueDateMs).toBeLessThanOrEqual(expectedMax);
    });
  });

  describe('registerReturn [inoportunos]', () => {
    it('should throw BadRequestException when loan is already returned', async () => {
      repository.findById.mockResolvedValue({ ...loanFixture, returnedAt: new Date() });

      await expect(service.registerReturn('loan-1')).rejects.toThrow(BadRequestException);
      expect(repository.registerReturn).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when loan does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.registerReturn('missing')).rejects.toThrow(NotFoundException);
    });

    it('should not call registerReturn when loan is already returned', async () => {
      repository.findById.mockResolvedValue({ ...loanFixture, returnedAt: new Date() });

      await expect(service.registerReturn('loan-1')).rejects.toThrow();

      expect(repository.registerReturn).toHaveBeenCalledTimes(0);
    });
  });
});
