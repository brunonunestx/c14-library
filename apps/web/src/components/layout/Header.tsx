import { NavLink } from 'react-router';

const links = [
  { to: '/books', label: 'Livros' },
  { to: '/members', label: 'Membros' },
  { to: '/loans', label: 'Empréstimos' },
];

export function Header() {
  return (
    <header style={styles.header}>
      <span style={styles.brand}>C14 Library</span>
      <nav style={styles.nav}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.linkActive : {}),
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '64px',
    background: '#1a1a2e',
    borderBottom: '1px solid #2a2a4a',
  },
  brand: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.2rem',
    letterSpacing: '0.02em',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  link: {
    color: '#a0a0c0',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  linkActive: {
    color: '#ffffff',
    borderBottom: '2px solid #6c63ff',
    paddingBottom: '2px',
  },
} satisfies Record<string, React.CSSProperties>;
