import PageContainer from 'layouts/PageContainer';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import api from 'services/api';
import TransactionTable from 'components/TransactionTable';
import Row from 'components/Row';
import Pagination from '@mui/material/Pagination';
import { useRouter } from 'next/router';
import useAccount from 'hooks/useAccount';
import AccountHeader from '../AccountHeader';
import AccountTabs from '../AccountTabs';

const PAGE_LIMIT = 20;

export default function AccountTransactions() {
  const router = useRouter();
  const address =
    typeof router.query.address === `string` ? router.query.address : ``;
  const [page, setPage] = useState(1);
  const { data: accountData } = useAccount(address);
  const lastSequence = useMemo(
    () => (accountData ? parseInt(accountData.sequence_number) : 0),
    [accountData],
  );
  const lastPage = useMemo(() => {
    return Math.ceil(lastSequence / PAGE_LIMIT);
  }, [lastSequence]);
  const pageParams = useMemo(() => {
    const start = Math.max(lastSequence - page * PAGE_LIMIT, 0);
    const limit = start === 0 ? lastSequence % PAGE_LIMIT : PAGE_LIMIT;
    return { start, limit };
  }, [lastSequence, page]);
  const { data } = useQuery(
    [`accountTransactions`, address, pageParams],
    () => api.getAccountTransactions(address, pageParams),
    { enabled: lastPage > 0 },
  );

  const handleChangePage = useCallback(
    (e: ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    },
    [],
  );

  return (
    <PageContainer>
      <AccountHeader />
      <AccountTabs tab="transactions" />
      <TransactionTable transactions={data} />
      <Row sx={{ p: 4, justifyContent: `center` }}>
        <Pagination count={lastPage} page={page} onChange={handleChangePage} />
      </Row>
    </PageContainer>
  );
}
