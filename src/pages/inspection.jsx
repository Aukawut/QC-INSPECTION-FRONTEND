import { Helmet } from 'react-helmet-async';

import AuthToken from 'src/components/auth/AuthToken';

import { InspectionView } from 'src/sections/inspection/view';

// ----------------------------------------------------------------------

export default function InspectionPage() {
  return (
    <>
      <AuthToken />
      <Helmet>
        <title> Inspection | QC Inspection System </title>
      </Helmet>

      <InspectionView />
    </>
  );
}
