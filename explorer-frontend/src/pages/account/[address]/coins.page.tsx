import PageContainer from 'layouts/PageContainer';
import AccountHeader from '../AccountHeader';
import AccountTabs from '../AccountTabs';

export default function AccountCoins() {
  return (
    <PageContainer>
      <AccountHeader />
      <AccountTabs tab="coins" />
    </PageContainer>
  );
}
