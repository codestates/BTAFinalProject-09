import PageContainer from 'layouts/PageContainer';
import AccountHeader from '../AccountHeader';
import AccountTabs from '../AccountTabs';

export default function AccountInfo() {
  return (
    <PageContainer>
      <AccountHeader />
      <AccountTabs tab="info" />
    </PageContainer>
  );
}
