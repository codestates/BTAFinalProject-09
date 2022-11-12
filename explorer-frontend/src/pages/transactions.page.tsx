import { Box, Pagination } from '@mui/material';
import Row from 'components/Row';
import SearchBar from 'components/SearchBar';
import TransactionTable from 'components/TransactionTable';
import useLedgerInfo from 'hooks/useLedgerInfo';
import PageContainer from 'layouts/PageContainer';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import api from 'services/api';

const PAGE_LIMIT = 20;
const MAX_PAGE = 1000; // eary transactions are may pruned

export default function TransactionList() {
  const [page, setPage] = useState(1);
  const { data: ledgerInfo } = useLedgerInfo({
    refetchInterval: 10000,
  });

  const lastVersion = useMemo(
    () => (ledgerInfo ? parseInt(ledgerInfo.ledger_version) : 0),
    [ledgerInfo],
  );
  const lastPage = useMemo(() => {
    return Math.min(Math.ceil(lastVersion / PAGE_LIMIT), MAX_PAGE);
  }, [lastVersion]);

  const pageParams = useMemo(() => {
    const start = Math.max(lastVersion - page * PAGE_LIMIT, 0);
    const limit = start === 0 ? lastVersion % PAGE_LIMIT : PAGE_LIMIT;
    return { start, limit };
  }, [lastVersion, page]);

  const { data } = useQuery(
    [`transactions`, pageParams],
    () => api.getTransactions(pageParams),
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
