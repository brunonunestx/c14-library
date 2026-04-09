import { Member, CreateMemberPayload, UpdateMemberPayload } from '../../domain';
import { BaseRepository } from './base.repository';

export class MembersRepository extends BaseRepository {
  findAll(): Promise<Member[]> {
    return this.http.get<Member[]>('/members').then((r) => r.data);
  }

  findById(id: string): Promise<Member> {
    return this.http.get<Member>(`/members/${id}`).then((r) => r.data);
  }

  create(payload: CreateMemberPayload): Promise<Member> {
    return this.http.post<Member>('/members', payload).then((r) => r.data);
  }

  update(id: string, payload: UpdateMemberPayload): Promise<Member> {
    return this.http.patch<Member>(`/members/${id}`, payload).then((r) => r.data);
  }

  remove(id: string): Promise<void> {
    return this.http.delete(`/members/${id}`).then(() => undefined);
  }
}

export const membersRepository = new MembersRepository();
