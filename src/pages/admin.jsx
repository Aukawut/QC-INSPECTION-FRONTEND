import { Helmet } from 'react-helmet-async';

import AuthTokenAdmin from 'src/components/auth/AuthTokenAdmin';

import { AdminView } from 'src/sections/admin/view';


// ----------------------------------------------------------------------
 
export default function AdminPage() {
  return (
    <>
      <AuthTokenAdmin />
      <Helmet>
        <title> Admin Approve | QC Inspection System </title>
      </Helmet>
      <AdminView />
    </>
  );
}
