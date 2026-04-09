import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoansRepository, LoanWithRelations } from './loans.repository';

const DEFAULT_LOAN_DAYS = 14;

@Injectable()
export class LoansService {
  constructor(
    private readonly repository: LoansRepository,
    private readonly booksService: BooksService,
    private readonly membersService: MembersService,
  ) {}

  findAll(): Promise<LoanWithRelations[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<LoanWithRelations> {
    const loan = await this.repository.findById(id);
    if (!loan) throw new NotFoundException(`Loan not found: ${id}`);
    return loan;
  }

  async registerReturn(id: string): Promise<LoanWithRelations> {
    const loan = await this.findById(id);
    if (loan.returnedAt) {
      throw new BadRequestException(`Loan already returned: ${id}`);
    }
    return this.repository.registerReturn(id);
  }

  async create(data: CreateLoanDto): Promise<LoanWithRelations> {
    const [book, _member, activeLoans] = await Promise.all([
      this.booksService.findById(data.bookId),
      this.membersService.findById(data.memberId),
      this.repository.countActiveByBookId(data.bookId),
    ]);

    if (activeLoans >= book.quantity) {
      throw new BadRequestException(`No copies available for book: ${data.bookId}`);
    }

    const dueDate = data.dueDate
      ? new Date(data.dueDate)
      : new Date(Date.now() + DEFAULT_LOAN_DAYS * 24 * 60 * 60 * 1000);

    return this.repository.create({
      book: { connect: { id: data.bookId } },
      member: { connect: { id: data.memberId } },
      dueDate,
    });
  }
}
