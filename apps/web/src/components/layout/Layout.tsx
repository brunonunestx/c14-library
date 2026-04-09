import { Outlet } from 'react-router';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
  return (
    <div style={styles.root}>
      <Header />
      <main style={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    background: '#0f0f1a',
    color: '#e0e0f0',
    fontFamily: 'system-ui, sans-serif',
  },
  main: {
    flex: 1,
    padding: '2rem',
  },
} satisfies Record<string, React.CSSProperties>;
