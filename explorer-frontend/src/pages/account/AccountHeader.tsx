import { useRouter } from 'next/router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import getFormattedBalanceStr from 'utils/getFormattedBalanceStr';
import useAccountResources from 'hooks/useAccountResources';

export default function AccountHeader() {
  const router = useRouter();
  const address =
    typeof router.query.address === `string` ? router.query.address : ``;

  const { data } = useAccountResources(address);

  const coinBalance = useMemo(() => {
    if (!data) {
      return `0`;
    }
    const found = data.find(
      (resource) =>
        resource.type === `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>`,
    );
    if (!found) {
      return `0`;
    }
    return found.data.coin.value;
  }, [data]);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <Box sx={{ m: 2 }}>
          <Typography variant="h3">Account</Typography>
        </Box>
        <Box sx={{ m: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            endIcon={<ContentCopyIcon />}
            onClick={copyAddress}
            sx={{ textTransform: `none` }}
          >
            {address}
          </Button>
        </Box>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card sx={{ p: 2 }}>
          <Stack spacing={1.5} marginY={1}>
            <Typography variant="h5">
              {getFormattedBalanceStr(coinBalance)} APT
            </Typography>
            <Typography>Balance</Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
