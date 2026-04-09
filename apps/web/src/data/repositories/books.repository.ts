import { Book, CreateBookPayload, UpdateBookPayload } from '../../domain';
import { BaseRepository } from './base.repository';

export class BooksRepository extends BaseRepository {
  findAll(): Promise<Book[]> {
    return this.http.get<Book[]>('/books').then((r) => r.data);
  }

  findById(id: string): Promise<Book> {
    return this.http.get<Book>(`/books/${id}`).then((r) => r.data);
  }

  create(payload: CreateBookPayload): Promise<Book> {
    return this.http.post<Book>('/books', payload).then((r) => r.data);
  }

  update(id: string, payload: UpdateBookPayload): Promise<Book> {
    return this.http.patch<Book>(`/books/${id}`, payload).then((r) => r.data);
  }

  remove(id: string): Promise<void> {
    return this.http.delete(`/books/${id}`).then(() => undefined);
  }
}

export const booksRepository = new BooksRepository();
