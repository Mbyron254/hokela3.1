import { useState, useEffect } from 'react';

import { _appAuthors, _appRelated, _appInvoices, _appFeatured, _appInstalled } from 'src/_mock';

interface IFeatured {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
}

interface IAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  totalFavorites: number;
}

interface IRelated {
  id: string;
  name: string;
  downloaded: number;
  ratingNumber: number;
  size: number;
  totalReviews: number;
  shortcut: string;
  price: number;
}

interface IInvoice {
  id: string;
  invoiceNumber: string;
  price: number;
  category: string;
  status: string;
}

interface IInstalled {
  id: string;
  countryName: string;
  android: number;
  windows: number;
  apple: number;
  countryCode: string;
}

interface IOverviewData {
  featured: IFeatured[];
  authors: IAuthor[];
  related: IRelated[];
  invoices: IInvoice[];
  installed: IInstalled[];
}

export function useOverviewData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IOverviewData>({
    featured: [],
    authors: [],
    related: [],
    invoices: [],
    installed: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setData({
          featured: _appFeatured,
          authors: _appAuthors,
          related: _appRelated,
          invoices: _appInvoices,
          installed: _appInstalled,
        });
      } catch (error) {
        console.error('Failed to load overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { loading, data };
}
