import { Helmet } from 'react-helmet-async';

import AuthToken from 'src/components/auth/AuthToken';

import { InspectionPartView } from 'src/sections/inspectionPart/view';

// ----------------------------------------------------------------------

export default function InspectionPartPage() {
  return (
    <>
      <AuthToken />
      <Helmet>
        <title> Inspection Part | QC Inspection System </title>
      </Helmet>

      <InspectionPartView />
    </>
  );
}
