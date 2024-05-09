import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import IntakeHistorySectionTaMenus1 from '../components/ta-menus/IntakeHistorySectionTaMenus1';
import IntakeHistorySectionTaTables3 from '../components/ta-tables/IntakeHistorySectionTaTables3';

const meta = {
  title: '',
  meta: [],
  link: [],
  style: [],
  script: [],
};

export default function IntakeHistory() {
  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet {...meta}></Helmet>
      </HelmetProvider>
      <IntakeHistorySectionTaMenus1 />
      <IntakeHistorySectionTaTables3 />
    </React.Fragment>
  );
}

