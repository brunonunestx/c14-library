import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../providers/prisma/prisma.service';

const include = { book: true, member: true } as const;

export type LoanWithRelations = Prisma.LoanGetPayload<{ include: typeof include }>;

@Injectable()
export class LoansRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<LoanWithRelations[]> {
    return this.prisma.loan.findMany({ include });
  }

  findById(id: string): Promise<LoanWithRelations | null> {
    return this.prisma.loan.findUnique({ where: { id }, include });
  }

  countActiveByBookId(bookId: string): Promise<number> {
    return this.prisma.loan.count({
      where: { bookId, returnedAt: null },
    });
  }

  create(data: Prisma.LoanCreateInput): Promise<LoanWithRelations> {
    return this.prisma.loan.create({ data, include });
  }

  registerReturn(id: string): Promise<LoanWithRelations> {
    return this.prisma.loan.update({
      where: { id },
      data: { returnedAt: new Date() },
      include,
    });
  }
}
