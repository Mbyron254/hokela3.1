'use client';

import type { IJobItem, IJobFilters } from 'src/types/job';

import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { GQLMutation } from 'src/lib/client';
import { DashboardContent } from 'src/layouts/dashboard';
import { M_OPEN_JOBS } from 'src/lib/mutations/campaign-run.mutation';
import {
  _roles,
  JOB_SORT_OPTIONS,
  JOB_BENEFIT_OPTIONS,
  JOB_EXPERIENCE_OPTIONS,
  JOB_EMPLOYMENT_TYPE_OPTIONS,
} from 'src/_mock';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobList } from '../job-list';
import { JobSort } from '../job-sort';
import { JobSearch } from '../job-search';
import { JobFilters } from '../job-filters';
import { JobFiltersResult } from '../job-filters-result';

import { formatDate } from 'src/lib/helpers';
import Image from 'next/image';
import { sourceImage } from 'src/lib/server';

// ----------------------------------------------------------------------

type TCampaignRun = {
  index: number;
  id: string;
  closeAdvertOn: string;
  poster: {
    fileName: string;
  };
  campaign: {
    id: string;
    name: string;
    jobDescription: string;
    clientTier2: {
      clientTier1: {
        name: string;
      };
    };
  };
};

export function JobListView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const { action: getJobs, data: jobs } = GQLMutation({
    mutation: M_OPEN_JOBS,
    resolver: 'openJobs',
    toastmsg: false,
  });

  const loadRunsActive = (page?: number, pageSize?: number) => {
    getJobs({ variables: { input: { page, pageSize } } });
  };

  useEffect(() => {
    loadRunsActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('JOBS  ', jobs);

  const search = useSetState<{
    query: string;
    results: IJobItem[];
  }>({ query: '', results: [] });

  const filters = useSetState<IJobFilters>({
    roles: [],
    locations: [],
    benefits: [],
    experience: 'all',
    employmentTypes: [],
  });

  const transformedJobs =
    jobs?.rows?.map((job: TCampaignRun) => ({
      id: job.id,
      title: job.campaign.name,
      description: job.campaign.jobDescription,
      createdAt: new Date().toISOString(),
      experience: 'Junior',
      role: 'Developer',
      locations: ['Remote'],
      employmentTypes: ['Full-time'],
      benefits: ['Healthcare', 'Annual Leave'],
      totalViews: 0,
      company: {
        name: job.campaign.clientTier2.clientTier1.name,
        logo: sourceImage(job.poster.fileName),
      },
      salary: {
        negotiable: true,
        price: 0,
      },
      candidates: [],
      closeAdvertOn: (job.closeAdvertOn),
    })) || [];

  const dataFiltered = applyFilter({ inputData: transformedJobs, filters: filters.state, sortBy });

  const canReset =
    filters.state.roles.length > 0 ||
    filters.state.locations.length > 0 ||
    filters.state.benefits.length > 0 ||
    filters.state.employmentTypes.length > 0 ||
    filters.state.experience !== 'all';

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      search.setState({ query: inputValue });

      if (inputValue) {
        const results = transformedJobs.filter(
          // @ts-ignore
          (job) => job.title.toLowerCase().indexOf(search.state.query.toLowerCase()) !== -1
        );

        search.setState({ results });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <JobSearch search={search} onSearch={handleSearch} />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <JobFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            roles: _roles,
            benefits: JOB_BENEFIT_OPTIONS.map((option) => option.label),
            employmentTypes: JOB_EMPLOYMENT_TYPE_OPTIONS.map((option) => option.label),
            experiences: ['all', ...JOB_EXPERIENCE_OPTIONS.map((option) => option.label)],
          }}
        />

        <JobSort sort={sortBy} onSort={handleSortBy} sortOptions={JOB_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = <JobFiltersResult filters={filters} totalResults={dataFiltered.length} />;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Janta', href: '/dashboard/janta' },
          { name: 'Open Jobs' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <JobList jobs={dataFiltered.map(job => ({
        ...job,
        logo: <Image
          src={job.company.logo}
          alt=""
          width={200}
          height={200}
        />,
        deadline: job.closeAdvertOn,
      }))} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IJobItem[];
  filters: IJobFilters;
  sortBy: string;
};

const applyFilter = ({ inputData, filters, sortBy }: ApplyFilterProps) => {
  const { employmentTypes, experience, roles, locations, benefits } = filters;

  // Sort by
  if (sortBy === 'latest') {
    // @ts-ignore
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    // @ts-ignore
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    // @ts-ignore
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  // Filters
  if (employmentTypes.length) {
    // @ts-ignore
    inputData = inputData.filter((job) =>
      // @ts-ignore
      job.employmentTypes.some((item) => employmentTypes.includes(item))
    );
  }

  if (experience !== 'all') {
    // @ts-ignore
    inputData = inputData.filter((job) => job.experience === experience);
  }

  if (roles.length) {
    // @ts-ignore
    inputData = inputData.filter((job) => roles.includes(job.role));
  }

  if (locations.length) {
    // @ts-ignore
    inputData = inputData.filter((job) => job.locations.some((item) => locations.includes(item)));
  }

  if (benefits.length) {
    // @ts-ignore
    inputData = inputData.filter((job) => job.benefits.some((item) => benefits.includes(item)));
  }

  return inputData;
};
