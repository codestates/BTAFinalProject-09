import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import Row from '../components/Row';
import PageContainer from '../layouts/PageContainer';
import TransactionPreview from '../components/TransactionPreview';

export default function Home() {
  return (
    <PageContainer>
      {/* Dashboard */}
      <Row gap={4} sx={{ m: 2 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4">1,003,190,431</Typography>
            <Typography variant="subtitle1">Total Supply</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4">1,003,190,431</Typography>
            <Typography variant="subtitle1">Total Transactions</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4">18</Typography>
            <Typography variant="subtitle1">TPS</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4">213176</Typography>
            <Typography variant="subtitle1">Latest Version</Typography>
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
