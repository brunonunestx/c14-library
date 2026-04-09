export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  loanedAt: string;
  dueDate: string;
  returnedAt: string | null;
  book: Book;
  member: Member;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  isbn: string;
  quantity?: number;
}

export interface UpdateBookPayload {
  title?: string;
  author?: string;
  isbn?: string;
  quantity?: number;
}

export interface CreateMemberPayload {
  name: string;
  email: string;
}

export interface UpdateMemberPayload {
  name?: string;
  email?: string;
}

export interface CreateLoanPayload {
  bookId: string;
  memberId: string;
  dueDate?: string;
}
