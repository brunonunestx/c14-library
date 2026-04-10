import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaService } from '../providers/prisma/prisma.service';

export type PrismaMock = DeepMockProxy<PrismaService>;

export const prismaMockProvider = (prisma: PrismaMock) => ({
  provide: PrismaService,
  useValue: prisma,
});

export { mockDeep };
