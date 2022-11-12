import PageContainer from 'layouts/PageContainer';
import AccountHeader from '../AccountHeader';
import AccountTabs from '../AccountTabs';

export default function AccountTokens() {
  return (
    <PageContainer>
      <AccountHeader />
      <AccountTabs tab="tokens" />
    </PageContainer>
  );
}
