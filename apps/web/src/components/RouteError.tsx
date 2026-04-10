import { useRouteError, isRouteErrorResponse } from 'react-router';

export function RouteError() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : 'Ocorreu um erro inesperado.';

  return (
    <div style={styles.wrapper}>
      <span style={styles.code}>Erro</span>
      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '0.5rem',
  },
  code: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#f87171',
  },
  message: {
    color: '#a0a0c0',
    fontSize: '0.95rem',
  },
};
