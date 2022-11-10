import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useQuery } from 'react-query';
import useGetTPS from 'hooks/useGetTPS';
import SearchBar from '../components/SearchBar';
import Row from '../components/Row';
import PageContainer from '../layouts/PageContainer';
import TransactionPreview from '../components/TransactionPreview';
import api from '../services/api';
import useTotalSupply from '../hooks/useTotalSupply';
import getFormattedBalanceStr from '../utils/getFormattedBalanceStr';

export default function Home() {
  const totalSupply = useTotalSupply();
  const { data } = useQuery([`ledgerInfo`], () => api.getLedgerInfo(), {
    refetchInterval: 10000,
  });
  const { tps } = useGetTPS();

  return (
    <PageContainer>
      {/* Dashboard */}
      <Row gap={4} sx={{ m: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h5">
              {totalSupply
                ? getFormattedBalanceStr(totalSupply, undefined, 0)
                : `-`}
            </Typography>
            <Typography variant="subtitle2">Total Supply</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h5">
              {data
                ? parseInt(data.ledger_version, 10).toLocaleString(`en-US`)
                : `-`}
            </Typography>
            <Typography variant="subtitle2">Total Transactions</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h5">
              {tps ? Math.round(tps).toLocaleString(`en-US`) : `-`}
            </Typography>
            <Typography variant="subtitle2">TPS</Typography>
          </CardContent>
        </Card>
      </Row>
      {/* Search Bar */}
      <Row sx={{ m: 2 }}>
        <SearchBar sx={{ flex: 1 }} />
      </Row>
      {/* Transactions */}
      <Row sx={{ m: 2 }}>
        <TransactionPreview />
      </Row>
    </PageContainer>
  );
}
