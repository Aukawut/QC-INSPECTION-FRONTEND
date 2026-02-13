import { Helmet } from 'react-helmet-async';

import AuthToken from 'src/components/auth/AuthToken';

import { HistoryView } from 'src/sections/history/view';

export default function HistoryPage() {
  return (
    <>
      <AuthToken />
      <Helmet>
        <title> History | QC Inspection System </title>
      </Helmet>

      <HistoryView />
    </>
  );
}
