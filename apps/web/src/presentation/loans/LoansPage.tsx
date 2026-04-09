import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal';
import { loansRepository } from '../../data/repositories';
import { CreateLoanPayload, Loan } from '../../domain';
import { LoanForm } from './LoanForm';

export function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [returning, setReturning] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  function fetchLoans() {
    setLoading(true);
    loansRepository
      .findAll()
      .then(setLoans)
      .catch(() => setError('Erro ao carregar empréstimos.'))
      .finally(() => setLoading(false));
  }

  async function handleCreate(payload: CreateLoanPayload) {
    await loansRepository.create(payload);
    setShowModal(false);
    fetchLoans();
  }

  async function handleReturn(id: string) {
    setReturning(id);
    try {
      await loansRepository.registerReturn(id);
      fetchLoans();
    } finally {
      setReturning(null);
    }
  }

  if (loading) return <p style={styles.feedback}>Carregando...</p>;
  if (error) return <p style={{ ...styles.feedback, color: '#f87171' }}>{error}</p>;

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Empréstimos</h1>
        <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>
          + Novo empréstimo
        </button>
      </div>

      {loans.length === 0 ? (
        <p style={styles.feedback}>Nenhum empréstimo registrado.</p>
      ) : (
        <div style={styles.list}>
          {loans.map((loan) => (
            <div key={loan.id} style={styles.card}>
              <div style={styles.cardMain}>
                <div style={styles.cardInfo}>
                  <span style={styles.bookTitle}>{loan.book.title}</span>
                  <span style={styles.memberName}>{loan.member.name}</span>
                  <span style={styles.memberEmail}>{loan.member.email}</span>
                </div>
                <div style={styles.cardDates}>
                  <span style={styles.dateLabel}>
                    Retirada: {new Date(loan.loanedAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span style={styles.dateLabel}>
                    Prazo: {new Date(loan.dueDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div style={styles.cardActions}>
                <span style={loan.returnedAt ? styles.badgeReturned : styles.badgeActive}>
                  {loan.returnedAt ? 'Devolvido' : 'Em aberto'}
                </span>
                {!loan.returnedAt && (
                  <button
                    style={styles.btnReturn}
                    disabled={returning === loan.id}
                    onClick={() => handleReturn(loan.id)}
                  >
                    {returning === loan.id ? 'Registrando...' : 'Registrar devolução'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Novo empréstimo" onClose={() => setShowModal(false)}>
          <LoanForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}

const styles = {
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#e0e0f0',
  },
  feedback: {
    color: '#a0a0c0',
    fontSize: '0.95rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem',
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    gap: '1rem',
  },
  cardMain: {
    display: 'flex',
    gap: '2rem',
    flex: 1,
    flexWrap: 'wrap' as const,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
  },
  bookTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#e0e0f0',
  },
  memberName: {
    fontSize: '0.875rem',
    color: '#a0a0c0',
  },
  memberEmail: {
    fontSize: '0.75rem',
    color: '#606080',
  },
  cardDates: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: '0.8rem',
    color: '#a0a0c0',
  },
  badgeActive: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.75rem',
    background: '#1e3a5f',
    color: '#60a5fa',
    borderRadius: '999px',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  badgeReturned: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.75rem',
    background: '#1a3a2a',
    color: '#4ade80',
    borderRadius: '999px',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
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
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.5rem',
    flexShrink: 0,
  },
  btnReturn: {
    padding: '0.35rem 0.85rem',
    background: 'transparent',
    color: '#60a5fa',
    border: '1px solid #1e3a5f',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, React.CSSProperties>;
