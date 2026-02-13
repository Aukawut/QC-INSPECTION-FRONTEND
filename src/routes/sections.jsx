import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const InspectionPage = lazy(() => import('src/pages/inspection'));
export const InspectionPartPage = lazy(() => import('src/pages/inspectionPart'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const PartMasterPage = lazy(() => import('src/pages/partMaster'));
export const HistoryPage = lazy(() => import('src/pages/history'));
export const AdminPage = lazy(() => import('src/pages/admin'));
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'inspection', element: <InspectionPage /> },
        { path: 'check/:partNo', element: <InspectionPartPage /> },
        { path: 'partMaster', element: <PartMasterPage /> },
        { path: 'history/:tab', element: <HistoryPage /> },
        { path: 'admin/approve/:query', element: <AdminPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
