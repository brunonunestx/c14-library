import { createBrowserRouter, RouterProvider } from 'react-router';
import { Layout } from '../components';
import { BooksPage, LoansPage, MembersPage } from '../presentation';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/books', element: <BooksPage /> },
      { path: '/members', element: <MembersPage /> },
      { path: '/loans', element: <LoansPage /> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
