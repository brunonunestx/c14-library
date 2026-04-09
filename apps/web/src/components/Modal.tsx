import { ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={styles.title}>{title}</span>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  dialog: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '480px',
    margin: '1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #2a2a4a',
  },
  title: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#e0e0f0',
  },
  close: {
    background: 'none',
    border: 'none',
    color: '#a0a0c0',
    cursor: 'pointer',
    fontSize: '1rem',
    lineHeight: 1,
  },
  body: {
    padding: '1.5rem',
  },
} satisfies Record<string, React.CSSProperties>;
