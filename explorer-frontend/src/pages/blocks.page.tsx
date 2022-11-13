import Box from '@mui/material/Box';
import Row from 'components/Row';
import SearchBar from 'components/SearchBar';
import useLedgerInfo from 'hooks/useLedgerInfo';
import PageContainer from 'layouts/PageContainer';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import api from 'services/api';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Skeleton from '@mui/material/Skeleton';
import Link from 'next/link';
import dayjs from 'dayjs';
import truncateAddress from 'utils/truncateAddress';
import ensureMillisecondTimestamp from 'utils/ensureMillisecondTimestamp';
import Chip from '@mui/material/Chip';

const BLOCK_COUNT = 20;

export default function BlockList() {
  const { data: ledgerInfo } = useLedgerInfo({
    refetchInterval: 10000,
  });
  const currentHeight = useMemo(
    () => (ledgerInfo ? parseInt(ledgerInfo.block_height) : 0),
    [ledgerInfo],
  );
  const { data } = useQuery(
    [`blocks`, { currentHeight, limit: BLOCK_COUNT }],
    () => api.getRecentBlocks(currentHeight, BLOCK_COUNT),
    { enabled: currentHeight > 0 },
  );

  const now = dayjs();

  return (
    <PageContainer>
      <Box sx={{ m: 2 }}>
        <Row>
          <SearchBar sx={{ flex: 1 }} />
        </Row>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Block</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Hash</TableCell>
              <TableCell>First Version</TableCell>
              <TableCell>Last Version</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!data
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
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))
              : data.map((block) => {
                  return (
                    <TableRow key={block.block_height}>
                      <TableCell>
                        <Link href={`/block/${block.block_height}`}>
                          {block.block_height}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {now.diff(
                          dayjs(
                            ensureMillisecondTimestamp(block.block_timestamp),
                          ),
                          `s`,
                        )}
                        s ago
                      </TableCell>
                      <TableCell>
                        <Chip label={truncateAddress(block.block_hash)} />
                      </TableCell>
                      <TableCell>
                        <Link href={`/txn/${block.first_version}`}>
                          {block.first_version}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/txn/${block.last_version}`}>
                          {block.last_version}
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </Box>
    </PageContainer>
  );
}
