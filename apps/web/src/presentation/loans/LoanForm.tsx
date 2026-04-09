import { FormEvent, useEffect, useState } from 'react';
import { booksRepository, membersRepository } from '../../data/repositories';
import { Book, CreateLoanPayload, Member } from '../../domain';

interface LoanFormProps {
  onSubmit: (payload: CreateLoanPayload) => Promise<void>;
  onCancel: () => void;
}

export function LoanForm({ onSubmit, onCancel }: LoanFormProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [bookId, setBookId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([booksRepository.findAll(), membersRepository.findAll()])
      .then(([b, m]) => {
        setBooks(b);
        setMembers(m);
      })
      .finally(() => setLoadingOptions(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        bookId,
        memberId,
        ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {}),
      });
    } catch {
      setError('Erro ao registrar empréstimo. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingOptions) return <p style={styles.loading}>Carregando opções...</p>;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Livro
        <select
          style={styles.select}
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
        >
          <option value="">Selecione um livro</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} — {book.author} ({book.quantity} disp.)
            </option>
          ))}
        </select>
      </label>

      <label style={styles.label}>
        Membro
        <select
          style={styles.select}
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
        >
          <option value="">Selecione um membro</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} — {member.email}
            </option>
          ))}
        </select>
      </label>

      <label style={styles.label}>
        Prazo de devolução
        <input
          style={styles.input}
          type="date"
          value={dueDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <span style={styles.hint}>Opcional — padrão: 14 dias a partir de hoje</span>
      </label>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.actions}>
        <button type="button" style={styles.btnSecondary} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" style={styles.btnPrimary} disabled={submitting}>
          {submitting ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  loading: {
    color: '#a0a0c0',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    fontSize: '0.875rem',
    color: '#a0a0c0',
  },
  select: {
    padding: '0.5rem 0.75rem',
    background: '#0f0f1a',
    border: '1px solid #2a2a4a',
    borderRadius: '6px',
    color: '#e0e0f0',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
  },
  input: {
    padding: '0.5rem 0.75rem',
    background: '#0f0f1a',
    border: '1px solid #2a2a4a',
    borderRadius: '6px',
    color: '#e0e0f0',
    fontSize: '0.9rem',
    outline: 'none',
  },
  hint: {
    fontSize: '0.75rem',
    color: '#606080',
  },
  error: {
    fontSize: '0.8rem',
    color: '#f87171',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  btnPrimary: {
    padding: '0.5rem 1.25rem',
    background: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  btnSecondary: {
    padding: '0.5rem 1.25rem',
    background: 'transparent',
    color: '#a0a0c0',
    border: '1px solid #2a2a4a',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
} satisfies Record<string, React.CSSProperties>;
