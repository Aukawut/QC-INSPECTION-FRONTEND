import { Helmet } from 'react-helmet-async';

import AuthTokenAdmin from 'src/components/auth/AuthTokenAdmin';

import { PartMasterView } from 'src/sections/partMaster/view';

// ----------------------------------------------------------------------

export default function PartMasterPage() {
  return (
    <>
      <AuthTokenAdmin />
      <Helmet>
        <title> Lists | Parts Master</title>
      </Helmet>

      <PartMasterView />
    </>
  );
}
