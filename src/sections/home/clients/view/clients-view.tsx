'use client';

import ClientsHero from '../clients-hero';
import { ClientsBrands } from '../clients-brands';
// import { ClientsAdvert } from '../clients-advert';
import { ClientsIndustries } from '../clients-industries';

// ----------------------------------------------------------------------

export default function ClientsView() {
  return (
    <>
    <ClientsHero/>
    <ClientsBrands/>
    <ClientsIndustries/>
    {/* <ClientsAdvert/> */}
    </>
  );
}
