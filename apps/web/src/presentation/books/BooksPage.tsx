import { useEffect, useState } from 'react';
import { Modal } from '../../components/Modal';
import { booksRepository } from '../../data/repositories';
import { Book, CreateBookPayload } from '../../domain';
import { BookForm } from './BookForm';

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  function fetchBooks() {
    setLoading(true);
    booksRepository
      .findAll()
      .then(setBooks)
      .catch(() => setError('Erro ao carregar livros.'))
      .finally(() => setLoading(false));
  }

  async function handleCreate(payload: CreateBookPayload) {
    await booksRepository.create(payload);
    setShowModal(false);
    fetchBooks();
  }

  if (loading) return <p style={styles.feedback}>Carregando...</p>;
  if (error) return <p style={{ ...styles.feedback, color: '#f87171' }}>{error}</p>;

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Livros</h1>
        <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>
          + Cadastrar livro
        </button>
      </div>

      {books.length === 0 ? (
        <p style={styles.feedback}>Nenhum livro cadastrado.</p>
      ) : (
        <div style={styles.grid}>
          {books.map((book) => (
            <div key={book.id} style={styles.card}>
              <span style={styles.cardTitle}>{book.title}</span>
              <span style={styles.cardAuthor}>{book.author}</span>
              <div style={styles.cardMeta}>
                <span style={styles.badge}>ISBN {book.isbn}</span>
                <span style={styles.badge}>{book.quantity} disponível(is)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Cadastrar livro" onClose={() => setShowModal(false)}>
          <BookForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
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
    gap: '0.4rem',
    padding: '1.25rem',
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#e0e0f0',
  },
  cardAuthor: {
    fontSize: '0.875rem',
    color: '#a0a0c0',
  },
  cardMeta: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  badge: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.6rem',
    background: '#2a2a4a',
    borderRadius: '999px',
    color: '#c0c0e0',
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
