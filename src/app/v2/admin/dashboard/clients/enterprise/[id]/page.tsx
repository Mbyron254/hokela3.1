import EnterpriseDetailsView from 'src/sections/admin/clients/enterprise/details/view/enterprise-details-view';

export const metadata = { title: `Enterprise Details` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  console.log('id', id);
  return <EnterpriseDetailsView id={id} />;
}
