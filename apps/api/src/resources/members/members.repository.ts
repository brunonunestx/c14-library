import { Injectable } from '@nestjs/common';
import { Member } from '@prisma/client';
import { PrismaService } from '../../providers/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Member[]> {
    return this.prisma.member.findMany();
  }

  findById(id: string): Promise<Member | null> {
    return this.prisma.member.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<Member | null> {
    return this.prisma.member.findUnique({ where: { email } });
  }

  create(data: CreateMemberDto): Promise<Member> {
    return this.prisma.member.create({ data });
  }

  update(id: string, data: UpdateMemberDto): Promise<Member> {
    return this.prisma.member.update({ where: { id }, data });
  }

  delete(id: string): Promise<Member> {
    return this.prisma.member.delete({ where: { id } });
  }
}
