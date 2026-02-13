import { Helmet } from 'react-helmet-async';

import AuthToken from 'src/components/auth/AuthToken';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <AuthToken />
      <Helmet> 
        <title> Dashboard | QC Inspection System </title>
      </Helmet>
      <AppView />
    </>
  );
}
