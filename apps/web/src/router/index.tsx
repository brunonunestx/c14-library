import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { Layout } from '../components';
import { RouteError } from '../components/RouteError';
import { BooksPage, LoansPage, MembersPage } from '../presentation';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/books" replace /> },
      { path: '/books', element: <BooksPage /> },
      { path: '/members', element: <MembersPage /> },
      { path: '/loans', element: <LoansPage /> },
      { path: '*', element: <Navigate to="/books" replace /> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
