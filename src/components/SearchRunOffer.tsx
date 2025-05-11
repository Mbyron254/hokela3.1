'use client';

import Image from 'next/image';

import { Dispatch, FC, useEffect, useState } from 'react';
import { GQLMutation } from 'src/lib/client';
import { M_RUN_OFFER, M_RUN_OFFERS_SEARCH } from 'src/lib/mutations/run-offer.mutation';
import { sourceImage } from 'src/lib/server';
import { LoadingSpan } from './LoadingSpan';

interface TSearchedOffer {
  id: string;
  name: string;
  email: string;
  fileName: string;
}

export const SearchRunOffer: FC<{ runId: string; setSelectedOffer: Dispatch<any> }> = ({
  runId,
  setSelectedOffer,
}) => {
  const {
    action: searchOffers,
    loading: searching,
    data: offers,
  } = GQLMutation({
    mutation: M_RUN_OFFERS_SEARCH,
    resolver: 'searchRunOffers',
    toastmsg: false,
  });
  const {
    action: getOffer,
    loading: loadingOffer,
    data: offer,
  } = GQLMutation({
    mutation: M_RUN_OFFER,
    resolver: 'runOffer',
  });

  const [search, setSearch] = useState<string>();
  const [runOffers, setRunOffers] = useState<TSearchedOffer[]>([]);

  const handleSearchOffers = () => {
    if (runId && search) {
      setRunOffers([]);
      searchOffers({ variables: { input: { runId, search } } });
    }
  };
  const handleSelect = (id: string) => {
    if (id) {
      getOffer({ variables: { input: { id } } });
    }
  };

  useEffect(() => {
    if (offers?.rows?.length) {
      const _runOffer: TSearchedOffer[] = [];

      offers.rows.forEach((_offer: any) => {
        _runOffer.push({
          id: _offer.id,
          name: _offer.agent?.user?.name,
          email: _offer.agent?.user?.email,
          fileName: _offer.agent?.user?.profile?.fileName,
        });
      });

      setRunOffers(_runOffer);
    }
  }, [offers?.rows]);
  useEffect(() => {
    if (offer) setSelectedOffer(offer);
  }, [offer, setSelectedOffer]);

  return (
    <>
      <div className="app-search">
        <div className="input-group">
          <input
            type="text"
            id="top-search"
            className="form-control dropdown-toggle"
            placeholder="Search agent..."
            defaultValue={search}
            onChange={(e) => setSearch(e.target.value === '' ? undefined : e.target.value)}
          />
          <span className="mdi mdi-magnify search-icon"/>
          <button
            className="input-group-text btn-primary"
            type="submit"
            disabled={searching}
            onClick={handleSearchOffers}
          >
            {searching && (
              <>
                <i className="spinner-border spinner-border-sm me-1" role="status" />
                Searching
              </>
            )}
            {!searching && <>Search</>}
          </button>
        </div>

        <p className="font-12 mt-2 mb-2">
          Found <span className="text-success">{offers?.count || 0}</span> agents
          <span className="float-end ms-2">{loadingOffer && <LoadingSpan />}</span>
        </p>

        {runOffers.length > 0 && (
          <div className="card border border-secondary mt-0">
            <div className="card-body p-2">
              {runOffers.map((o: any, i: number) => (
                <a href="#" key={`offer-${i}`} onClick={() => handleSelect(offer.id)}>
                  <div className="d-flex align-items-start mt-1 mb-1">
                    <Image
                      className="rounded-circle me-2"
                      src={sourceImage(o?.fileName)}
                      loader={() => sourceImage(o?.fileName)}
                      alt=""
                      width={32}
                      height={32}
                    />
                    <div className="w-100 overflow-hidden">
                      {/* <span className="badge badge-warning-lighten float-end">Cold lead</span> */}
                      <h5 className="mt-0 mb-0">{offer.name}</h5>
                      <span className="text-muted font-13">{offer.email}</span>
                    </div>
                  </div>
                  {i + 1 !== runOffers.length && <hr className="mt-0 mb-2" />}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
