import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal';
import { membersRepository } from '../../data/repositories';
import { Member, CreateMemberPayload } from '../../domain';
import { MemberForm } from './MemberForm';

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  function fetchMembers() {
    setLoading(true);
    membersRepository
      .findAll()
      .then(setMembers)
      .catch(() => setError('Erro ao carregar membros.'))
      .finally(() => setLoading(false));
  }

  async function handleCreate(payload: CreateMemberPayload) {
    await membersRepository.create(payload);
    setShowModal(false);
    fetchMembers();
  }

  if (loading) return <p style={styles.feedback}>Carregando...</p>;
  if (error) return <p style={{ ...styles.feedback, color: '#f87171' }}>{error}</p>;

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Membros</h1>
        <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>
          + Cadastrar membro
        </button>
      </div>

      {members.length === 0 ? (
        <p style={styles.feedback}>Nenhum membro cadastrado.</p>
      ) : (
        <div style={styles.grid}>
          {members.map((member) => (
            <div key={member.id} style={styles.card}>
              <span style={styles.cardName}>{member.name}</span>
              <span style={styles.cardEmail}>{member.email}</span>
              <span style={styles.cardDate}>
                Cadastrado em {new Date(member.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Cadastrar membro" onClose={() => setShowModal(false)}>
          <MemberForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.35rem',
    padding: '1.25rem',
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
  },
  cardName: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#e0e0f0',
  },
  cardEmail: {
    fontSize: '0.875rem',
    color: '#a0a0c0',
  },
  cardDate: {
    fontSize: '0.75rem',
    color: '#606080',
    marginTop: '0.25rem',
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
} satisfies Record<string, React.CSSProperties>;
