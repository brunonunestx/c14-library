import { FormEvent, useState } from 'react';
import { CreateMemberPayload } from '../../domain';

interface MemberFormProps {
  onSubmit: (payload: CreateMemberPayload) => Promise<void>;
  onCancel: () => void;
}

export function MemberForm({ onSubmit, onCancel }: MemberFormProps) {
  const [fields, setFields] = useState<CreateMemberPayload>({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof CreateMemberPayload>(key: K, value: CreateMemberPayload[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(fields);
    } catch {
      setError('Erro ao cadastrar membro. Verifique os dados e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Nome
        <input
          style={styles.input}
          value={fields.name}
          onChange={(e) => set('name', e.target.value)}
          required
        />
      </label>

      <label style={styles.label}>
        E-mail
        <input
          style={styles.input}
          type="email"
          value={fields.email}
          onChange={(e) => set('email', e.target.value)}
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
