import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member } from '@prisma/client';
import { MembersRepository } from './members.repository';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly repository: MembersRepository) {}

  findAll(): Promise<Member[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<Member> {
    const member = await this.repository.findById(id);
    if (!member) throw new NotFoundException(`Member not found: ${id}`);
    return member;
  }

  async create(data: CreateMemberDto): Promise<Member> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) throw new ConflictException(`Email already registered: ${data.email}`);
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateMemberDto): Promise<Member> {
    await this.findById(id);
    return this.repository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }
}
