import useAccountResources from 'hooks/useAccountResources';
import PageContainer from 'layouts/PageContainer';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import getCoinNameFromResourceType from 'utils/getCoinNameFromResourceType';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Skeleton from '@mui/material/Skeleton';
import getFormattedBalanceStr from 'utils/getFormattedBalanceStr';
import getCoinPathFromResourceType from 'utils/getCoinPathFromResourceType';
import truncateAddressMiddle from 'utils/truncateAddressMiddle';
import Box from '@mui/material/Box';
import AccountTabs from '../AccountTabs';
import AccountHeader from '../AccountHeader';

export default function AccountCoins() {
  const router = useRouter();
  const address =
    typeof router.query.address === `string` ? router.query.address : ``;
  const { data } = useAccountResources(address);

  const coinStores = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const filtered = data.filter((res) => {
      const [resType] = res.type.split(`<`);
      return resType === `0x1::coin::CoinStore`;
    });

    return filtered.map((res) => ({
      type: getCoinPathFromResourceType(res.type),
      name: getCoinNameFromResourceType(res.type),
      value: res.data?.coin.value || `0`,
    }));
  }, [data]);

  return (
    <PageContainer>
      <Box sx={{ m: 2 }}>
        <AccountHeader />
        <AccountTabs tab="coins" />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Coin Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!coinStores
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))
              : coinStores.map((store) => (
                  <TableRow key={store.type}>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{getFormattedBalanceStr(store.value)}</TableCell>
                    <TableCell>{truncateAddressMiddle(store.type)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </Box>
    </PageContainer>
  );
}
