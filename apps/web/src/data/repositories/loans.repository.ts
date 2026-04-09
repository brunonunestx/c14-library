import { Loan, CreateLoanPayload } from '../../domain';
import { BaseRepository } from './base.repository';

export class LoansRepository extends BaseRepository {
  findAll(): Promise<Loan[]> {
    return this.http.get<Loan[]>('/loans').then((r) => r.data);
  }

  findById(id: string): Promise<Loan> {
    return this.http.get<Loan>(`/loans/${id}`).then((r) => r.data);
  }

  create(payload: CreateLoanPayload): Promise<Loan> {
    return this.http.post<Loan>('/loans', payload).then((r) => r.data);
  }

  registerReturn(id: string): Promise<Loan> {
    return this.http.patch<Loan>(`/loans/${id}/return`).then((r) => r.data);
  }
}

export const loansRepository = new LoansRepository();
