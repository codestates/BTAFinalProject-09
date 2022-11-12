import useAccountResources from 'hooks/useAccountResources';
import PageContainer from 'layouts/PageContainer';
import { useRouter } from 'next/router';
import AccountHeader from '../AccountHeader';
import AccountTabs from '../AccountTabs';

export default function AccountCoins() {
  const router = useRouter();
  const address =
    typeof router.query.address === `string` ? router.query.address : ``;
  const { data } = useAccountResources(address);

  console.log(data);

  return (
    <PageContainer>
      <AccountHeader />
      <AccountTabs tab="coins" />
    </PageContainer>
  );
}
