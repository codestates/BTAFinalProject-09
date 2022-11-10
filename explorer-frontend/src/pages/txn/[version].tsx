import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Types } from 'aptos';
import AmountCell from 'components/TransactionTable/AmountCell';
import FunctionCell from 'components/TransactionTable/FunctionCell';
import dayjs from 'dayjs';
import { useGetBlockByVersion } from 'hooks/useGetBlock';
import PageContainer from 'layouts/PageContainer';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useQuery } from 'react-query';
import api from 'services/api';
import ensureMillisecondTimestamp from 'utils/ensureMillisecondTimestamp';
import getFormattedBalanceStr from 'utils/getFormattedBalanceStr';
import getTransactionCounterparty from 'utils/getTransactionCounterParty';
import truncateAddress from 'utils/truncateAddress';

function GridRow({ title, content }: { title: string; content: ReactNode }) {
  return (
    <Grid container>
      <Grid item sm={3}>
        <Typography>{title}</Typography>
      </Grid>
      <Grid item sm={9}>
        <Typography>{content}</Typography>
      </Grid>
    </Grid>
  );
}

export default function TransactionDetail() {
  const router = useRouter();
  const version =
    typeof router.query.version === `string` ? router.query.version : ``;

  const { isLoading, data, error } = useQuery<Types.Transaction>(
    [`transaction`, version],
    () => api.getTransactionByVersion(parseInt(version)),
  );

  const { data: block } = useGetBlockByVersion({ version: parseInt(version) });

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

  if (data?.type === `user_transaction`) {
    const tx = data as Types.Transaction_UserTransaction;
    const counterparty = getTransactionCounterparty(tx);
    return (
      <PageContainer>
        <Card sx={{ m: 2 }}>
          <CardContent>
            <Box
              gap={4}
              sx={{ p: 2, display: `flex`, flexDirection: `column` }}
            >
              <GridRow title="Version" content={tx.version} />
              <GridRow
                title="Status"
                content={
                  tx.success ? (
                    <Typography color="green">Success</Typography>
                  ) : (
                    <Typography color="red">Fail</Typography>
                  )
                }
              />
              <GridRow
                title="Sender"
                content={
                  <Link href={`/account/${tx.sender}`}>
                    {truncateAddress(tx.sender)}
                  </Link>
                }
              />
              {counterparty?.role === `receiver` && (
                <GridRow
                  title="Receiver"
                  content={
                    <Link href={`/account/${counterparty.address}`}>
                      {truncateAddress(counterparty.address)}
                    </Link>
                  }
                />
              )}
              {counterparty?.role === `smartContract` && (
                <GridRow
                  title="Smart Contract"
                  content={
                    <Link href={`/account/${counterparty.address}`}>
                      {truncateAddress(counterparty.address)}
                    </Link>
                  }
                />
              )}
              <GridRow
                title="Function"
                content={<FunctionCell transaction={tx} />}
              />
              <GridRow
                title="Amount"
                content={<AmountCell transaction={tx} />}
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ m: 2 }}>
          <CardContent>
            <Box
              gap={4}
              sx={{ p: 2, display: `flex`, flexDirection: `column` }}
            >
              <GridRow
                title="Block"
                content={
                  block ? (
                    <Link href={`/block/${block.block_height}`}>
                      {block.block_height}
                    </Link>
                  ) : (
                    `-`
                  )
                }
              />
              <GridRow title="Sequence Number" content={tx.sequence_number} />
              <GridRow
                title="Expiration Timestamp"
                content={dayjs(
                  ensureMillisecondTimestamp(tx.expiration_timestamp_secs),
                ).format(`YYYY-MM-DD HH:mm:ss`)}
              />
              <GridRow
                title="Timestamp"
                content={dayjs(ensureMillisecondTimestamp(tx.timestamp)).format(
                  `YYYY-MM-DD HH:mm:ss`,
                )}
              />
              <GridRow
                title="Gas Fee"
                content={`${getFormattedBalanceStr(
                  (BigInt(tx.gas_used) * BigInt(tx.gas_unit_price)).toString(),
                )} APT`}
              />
              <GridRow
                title="Gas Unit Price"
                content={`${getFormattedBalanceStr(tx.gas_unit_price)} APT`}
              />
              <GridRow
                title="Max Gas Limit"
                content={`${parseInt(tx.max_gas_amount).toLocaleString(
                  `en-US`,
                )} Gas Units`}
              />
              <GridRow title="VM Status" content={tx.vm_status} />
            </Box>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (data?.type === `block_metadata_transaction`) {
    const tx = data as Types.Transaction_BlockMetadataTransaction;
    return (
      <PageContainer>
        <Card sx={{ m: 2 }}>
          <CardContent>
            <Box
              gap={4}
              sx={{ p: 2, display: `flex`, flexDirection: `column` }}
            >
              <GridRow title="Type" content={tx.type} />
              <GridRow title="Version" content={tx.version} />
              <GridRow
                title="Status"
                content={
                  tx.success ? (
                    <Typography color="green">Success</Typography>
                  ) : (
                    <Typography color="red">Fail</Typography>
                  )
                }
              />
              <GridRow
                title="Proposer"
                content={
                  <Link href={`/account/${tx.proposer}`}>
                    {truncateAddress(tx.proposer)}
                  </Link>
                }
              />
              <GridRow title="ID" content={tx.id} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ m: 2 }}>
          <CardContent>
            <Box
              gap={4}
              sx={{ p: 2, display: `flex`, flexDirection: `column` }}
            >
              <GridRow
                title="Block"
                content={
                  block ? (
                    <Link href={`/block/${block.block_height}`}>
                      {block.block_height}
                    </Link>
                  ) : (
                    `-`
                  )
                }
              />
              <GridRow title="Epoch" content={tx.epoch} />
              <GridRow title="Round" content={tx.round} />
              <GridRow
                title="Timestamp"
                content={dayjs(ensureMillisecondTimestamp(tx.timestamp)).format(
                  `YYYY-MM-DD HH:mm:ss`,
                )}
              />
              <GridRow title="VM Status" content={tx.vm_status} />
            </Box>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (data?.type === `state_checkpoint_transaction`) {
    const tx = data as Types.Transaction_StateCheckpointTransaction;
    return (
      <PageContainer>
        <Card sx={{ m: 2 }}>
          <CardContent>
            <Box
              gap={4}
              sx={{ p: 2, display: `flex`, flexDirection: `column` }}
            >
              <GridRow title="Type" content={tx.type} />
              <GridRow title="Version" content={tx.version} />
              <GridRow
                title="Status"
                content={
                  tx.success ? (
                    <Typography color="green">Success</Typography>
                  ) : (
                    <Typography color="red">Fail</Typography>
                  )
                }
              />
              <GridRow
                title="Block"
                content={
                  block ? (
                    <Link href={`/block/${block.block_height}`}>
                      {block.block_height}
                    </Link>
                  ) : (
                    `-`
                  )
                }
              />
              <GridRow
                title="Timestamp"
                content={dayjs(ensureMillisecondTimestamp(tx.timestamp)).format(
                  `YYYY-MM-DD HH:mm:ss`,
                )}
              />
              <GridRow title="VM Status" content={tx.vm_status} />
            </Box>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return <PageContainer>Unknown Transaction</PageContainer>;
}
