import { FormEvent, useState } from 'react';
import { CreateBookPayload } from '../../domain';

function isValidIsbn(value: string): boolean {
  const digits = value.replace(/[-\s]/g, '');

  if (digits.length === 10) {
    const sum = digits
      .split('')
      .reduce((acc, ch, i) => acc + (ch === 'X' && i === 9 ? 10 : parseInt(ch, 10)) * (10 - i), 0);
    return sum % 11 === 0;
  }

  if (digits.length === 13) {
    const sum = digits
      .split('')
      .reduce((acc, ch, i) => acc + parseInt(ch, 10) * (i % 2 === 0 ? 1 : 3), 0);
    return sum % 10 === 0;
  }

  return false;
}

interface BookFormProps {
  onSubmit: (payload: CreateBookPayload) => Promise<void>;
  onCancel: () => void;
}

export function BookForm({ onSubmit, onCancel }: BookFormProps) {
  const [fields, setFields] = useState<CreateBookPayload>({
    title: '',
    author: '',
    isbn: '',
    quantity: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isbnError, setIsbnError] = useState<string | null>(null);

  function set<K extends keyof CreateBookPayload>(key: K, value: CreateBookPayload[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleIsbnChange(value: string) {
    set('isbn', value);
    setIsbnError(value && !isValidIsbn(value) ? 'ISBN inválido. Informe um ISBN-10 ou ISBN-13 válido.' : null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidIsbn(fields.isbn)) {
      setIsbnError('ISBN inválido. Informe um ISBN-10 ou ISBN-13 válido.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(fields);
    } catch {
      setError('Erro ao cadastrar livro. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Título
        <input
          style={styles.input}
          value={fields.title}
          onChange={(e) => set('title', e.target.value)}
          required
        />
      </label>

      <label style={styles.label}>
        Autor
        <input
          style={styles.input}
          value={fields.author}
          onChange={(e) => set('author', e.target.value)}
          required
        />
      </label>

      <label style={styles.label}>
        ISBN
        <input
          style={{ ...styles.input, ...(isbnError ? styles.inputError : {}) }}
          value={fields.isbn}
          onChange={(e) => handleIsbnChange(e.target.value)}
          placeholder="ISBN-10 ou ISBN-13"
          required
        />
        {isbnError && <span style={styles.fieldError}>{isbnError}</span>}
      </label>

      <label style={styles.label}>
        Quantidade
        <input
          style={styles.input}
          type="number"
          min={1}
          value={fields.quantity}
          onChange={(e) => set('quantity', Number(e.target.value))}
          required
        />
      </label>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.actions}>
        <button type="button" style={styles.btnSecondary} onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" style={styles.btnPrimary} disabled={submitting}>
          {submitting ? 'Salvando...' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}

const styles = {
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
  input: {
    padding: '0.5rem 0.75rem',
    background: '#0f0f1a',
    border: '1px solid #2a2a4a',
    borderRadius: '6px',
    color: '#e0e0f0',
    fontSize: '0.9rem',
    outline: 'none',
  },
  error: {
    fontSize: '0.8rem',
    color: '#f87171',
  },
  fieldError: {
    fontSize: '0.75rem',
    color: '#f87171',
  },
  inputError: {
    borderColor: '#f87171',
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
