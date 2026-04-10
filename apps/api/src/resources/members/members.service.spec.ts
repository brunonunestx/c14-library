import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { mockDeep, PrismaMock, prismaMockProvider } from '../../test/prisma.mock';
import { MembersRepository } from './members.repository';
import { MembersService } from './members.service';

const memberFixture = {
  id: 'member-1',
  name: 'João Silva',
  email: 'joao@email.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('MembersService', () => {
  let service: MembersService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();

    const module = await Test.createTestingModule({
      providers: [MembersService, MembersRepository, prismaMockProvider(prisma)],
    }).compile();

    service = module.get(MembersService);
  });

  describe('findAll', () => {
    it('should return all members', async () => {
      prisma.member.findMany.mockResolvedValue([memberFixture]);

      const result = await service.findAll();

      expect(result).toEqual([memberFixture]);
      expect(prisma.member.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a member when it exists', async () => {
      prisma.member.findUnique.mockResolvedValue(memberFixture);

      const result = await service.findById('member-1');

      expect(result).toEqual(memberFixture);
    });

    it('should throw NotFoundException when member does not exist', async () => {
      prisma.member.findUnique.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a member when email is not taken', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      prisma.member.create.mockResolvedValue(memberFixture);

      const result = await service.create({ name: 'João Silva', email: 'joao@email.com' });

      expect(result).toEqual(memberFixture);
      expect(prisma.member.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when email is already registered', async () => {
      prisma.member.findUnique.mockResolvedValue(memberFixture);

      await expect(
        service.create({ name: 'Outro', email: 'joao@email.com' }),
      ).rejects.toThrow(ConflictException);

      expect(prisma.member.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a member when it exists', async () => {
      const updated = { ...memberFixture, name: 'João Atualizado' };
      prisma.member.findUnique.mockResolvedValue(memberFixture);
      prisma.member.update.mockResolvedValue(updated);

      const result = await service.update('member-1', { name: 'João Atualizado' });

      expect(result.name).toBe('João Atualizado');
    });

    it('should throw NotFoundException when member does not exist', async () => {
      prisma.member.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { name: 'X' })).rejects.toThrow(NotFoundException);
      expect(prisma.member.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a member when it exists', async () => {
      prisma.member.findUnique.mockResolvedValue(memberFixture);
      prisma.member.delete.mockResolvedValue(memberFixture);

      await expect(service.remove('member-1')).resolves.toBeUndefined();
      expect(prisma.member.delete).toHaveBeenCalledWith({ where: { id: 'member-1' } });
    });

    it('should throw NotFoundException when member does not exist', async () => {
      prisma.member.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
      expect(prisma.member.delete).not.toHaveBeenCalled();
    });
  });
});
