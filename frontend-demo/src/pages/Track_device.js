import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import TrackDeviceSectionTaMenus1 from '../components/ta-menus/TrackDeviceSectionTaMenus1';

const meta = {
  title: '',
  meta: [],
  link: [],
  style: [],
  script: [],
};

export default function TrackDevice() {
  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet {...meta}></Helmet>
      </HelmetProvider>
      <TrackDeviceSectionTaMenus1 />
    </React.Fragment>
  );
}

