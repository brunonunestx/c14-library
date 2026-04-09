export function Footer() {
  return (
    <footer style={styles.footer}>
      <span style={styles.text}>© {new Date().getFullYear()} C14 Library</span>
    </footer>
  );
}

const styles = {
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    background: '#1a1a2e',
    borderTop: '1px solid #2a2a4a',
  },
  text: {
    color: '#606080',
    fontSize: '0.8rem',
  },
} satisfies Record<string, React.CSSProperties>;
