import React, { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import FormsSectionTaMenus6 from '../components/ta-menus/FormsSectionTaMenus6';
import FormsSectionTaMenus1 from '../components/ta-menus/FormsSectionTaMenus1';

const meta = {
  title: '',
  meta: [],
  link: [],
  style: [],
  script: [],
};

export default function Forms() {
  useEffect(() => {
    // Custom CSS classes for elements from the index.html
    let classes = document.body.classList;
    document.body.classList.remove(...classes);
    document.body.classList.add(
      ...'antialiased font-body bg-body text-body px-10'.split(' ')
    );
  });

  return (
    <React.Fragment>
      <HelmetProvider>
        <Helmet {...meta}></Helmet>
      </HelmetProvider>
      <FormsSectionTaMenus6 />
      <FormsSectionTaMenus1 />
    </React.Fragment>
  );
}

