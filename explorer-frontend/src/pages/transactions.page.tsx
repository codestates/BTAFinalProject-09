import { Box, Pagination } from '@mui/material';
import Row from 'components/Row';
import SearchBar from 'components/SearchBar';
import TransactionTable from 'components/TransactionTable';
import PageContainer from 'layouts/PageContainer';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import api from 'services/api';

const PAGE_LIMIT = 20;

export default function TransactionList() {
  const [page, setPage] = useState(1);
  const { data: ledgerInfo } = useQuery(
    [`ledgerInfo`],
    () => api.getLedgerInfo(),
    {
      refetchInterval: 10000,
    },
  );

  const lastPage = useMemo(() => {
    const lastVersion = ledgerInfo ? parseInt(ledgerInfo.ledger_version) : 0;
    return Math.floor(lastVersion / PAGE_LIMIT);
  }, [ledgerInfo]);

  const pageParams = useMemo(() => {
    return {
      start: (lastPage - page) * PAGE_LIMIT,
      limit: PAGE_LIMIT,
    };
  }, [lastPage, page]);

  const { data } = useQuery([`transactions`, pageParams], () =>
    api.getTransactions(pageParams),
  );

  const handleChangePage = useCallback(
    (e: ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    },
    [],
  );

  return (
    <PageContainer>
      <Box sx={{ m: 2 }}>
        <Row>
          <SearchBar sx={{ flex: 1 }} />
        </Row>
        <TransactionTable transactions={data} />
        <Row sx={{ p: 4, justifyContent: `center` }}>
          <Pagination
            count={lastPage}
            page={page}
            onChange={handleChangePage}
          />
        </Row>
      </Box>
    </PageContainer>
  );
}
