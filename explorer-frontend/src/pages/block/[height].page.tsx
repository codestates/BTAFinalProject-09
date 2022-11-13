import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Types } from 'aptos';
import dayjs from 'dayjs';
import PageContainer from 'layouts/PageContainer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import api from 'services/api';
import ensureMillisecondTimestamp from 'utils/ensureMillisecondTimestamp';
import truncateAddress from 'utils/truncateAddress';
import SearchBar from 'components/SearchBar';
import Row from 'components/Row';
import Chip from '@mui/material/Chip';

function isBlockMetadataTransaction(
  txn: Types.Transaction,
): txn is Types.Transaction_BlockMetadataTransaction {
  return (
    (txn as Types.Transaction_BlockMetadataTransaction).type ===
    `block_metadata_transaction`
  );
}

function GridRow({ title, content }: { title: string; content: ReactNode }) {
  return (
    <Grid container>
      <Grid item sm={3}>
        <Typography>{title}</Typography>
      </Grid>
      <Grid item sm={9}>
        {content}
      </Grid>
    </Grid>
  );
}

export default function BlockDetail() {
  const router = useRouter();
  const height =
    typeof router.query.height === `string` ? parseInt(router.query.height) : 0;

  const { isLoading, data, error } = useQuery([`block`, height], () =>
    api.getBlockByHeight(height, true),
  );

  if (error) {
    return <Typography color="danger">Unkown Error</Typography>;
  }

  if (isLoading) {
    return (
      <PageContainer>
        <CircularProgress />
      </PageContainer>
    );
  }

  if (!data) {
    return <PageContainer>Block Not Found</PageContainer>;
  }

  const blockTx: Types.Transaction_BlockMetadataTransaction | undefined = (
    data.transactions ?? []
  ).find(isBlockMetadataTransaction);

  return (
    <PageContainer>
      <Row sx={{ m: 2 }}>
        <SearchBar sx={{ flex: 1 }} />
      </Row>
      <Box sx={{ m: 2 }}>
        <Typography variant="h3">Block</Typography>
      </Box>
      <Box>
        <Card sx={{ m: 2 }}>
          <CardContent>
            <Box
              gap={4}
              sx={{ p: 2, display: `flex`, flexDirection: `column` }}
            >
              <GridRow title="Block Height" content={data.block_height} />
              <GridRow
                title="Block Hash"
                content={<Chip label={data.block_hash} />}
              />
              <GridRow
                title="Version"
                content={`${data.first_version} - ${data.last_version}`}
              />
              <GridRow
                title="Timestamp"
                content={dayjs(
                  ensureMillisecondTimestamp(data.block_timestamp),
                ).format(`YYYY-MM-DD HH:mm:ss`)}
              />
              {blockTx && (
                <>
                  <GridRow
                    title="Proposer"
                    content={
                      <Link href={`/account/${blockTx.proposer}`}>
                        {truncateAddress(blockTx.proposer)}
                      </Link>
                    }
                  />
                  <GridRow title="Epoch" content={blockTx.epoch} />
                  <GridRow title="Round" content={blockTx.round} />
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
}
