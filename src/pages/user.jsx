import { Helmet } from 'react-helmet-async';

import AuthTokenAdmin from 'src/components/auth/AuthTokenAdmin';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <AuthTokenAdmin />
      <Helmet>
        <title> Lists | Users Master</title>
      </Helmet>

      <UserView />
    </>
  );
}
