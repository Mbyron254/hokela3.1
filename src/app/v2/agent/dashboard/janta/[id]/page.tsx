'use client';

import { JobDetailsView } from 'src/sections/job/view';

// ----------------------------------------------------------------------

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  return <JobDetailsView params={{ id }} />;
}