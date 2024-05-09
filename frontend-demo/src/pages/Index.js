import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import IndexSection__elements3 from '../components/__elements/IndexSection__elements3';
import IndexSection__elements15 from '../components/__elements/IndexSection__elements15';
import IndexSectionTaMenus16 from '../components/ta-menus/IndexSectionTaMenus16';
import IndexSectionTaMenus1 from '../components/ta-menus/IndexSectionTaMenus1';

const meta = {
  title: '',
  meta: [],
  link: [],
  style: [],
  script: [],
};

export default function Index() {
  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet {...meta}></Helmet>
      </HelmetProvider>
      <IndexSection__elements3 />
      <IndexSection__elements15 />
      <IndexSectionTaMenus16 />
      <IndexSectionTaMenus1 />
    </React.Fragment>
  );
}

