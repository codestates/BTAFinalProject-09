import { FC, PropsWithChildren } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Types } from 'aptos';
import dayjs from 'dayjs';
import Link from 'next/link';
import Skeleton from '@mui/material/Skeleton';
import getTransactionCounterparty from '../utils/getTransactionCounterParty';
import truncateAddress from '../utils/truncateAddress';
import ensureMillisecondTimestamp from '../utils/ensureMillisecondTimestamp';
import FunctionCell from './TransactionTable/FunctionCell';
import AmountCell from './TransactionTable/AmountCell';

interface TransactionTableProps extends PropsWithChildren {
  transactions: Types.Transaction[] | undefined;
}

const TransactionTable: FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Version</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Timestamp</TableCell>
          <TableCell>Sender</TableCell>
          <TableCell>Sent To</TableCell>
          <TableCell>Function</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {!transactions
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
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))
          : transactions.map((tx) => {
              const receiverOrCounterparty = getTransactionCounterparty(tx);
              return (
                <TableRow key={tx.hash}>
                  <TableCell>
                    {`version` in tx ? (
                      <Link href={`/txn/${tx.version}`}>{tx.version}</Link>
                    ) : (
                      `-`
                    )}
                  </TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>
                    {`timestamp` in tx
                      ? dayjs(ensureMillisecondTimestamp(tx.timestamp)).format(
                          `YYYY-MM-DD HH:mm:ss`,
                        )
                      : ``}
                  </TableCell>
                  <TableCell>
                    {`sender` in tx ? (
                      <Link href={`/account/${tx.sender}`}>
                        {truncateAddress(tx.sender)}
                      </Link>
                    ) : (
                      ``
                    )}
                  </TableCell>
                  <TableCell>
                    {receiverOrCounterparty ? (
                      <Link href={`/account/${receiverOrCounterparty.address}`}>
                        {truncateAddress(receiverOrCounterparty.address)}
                      </Link>
                    ) : (
                      ``
                    )}
                  </TableCell>
                  <TableCell>
                    <FunctionCell transaction={tx} />
                  </TableCell>
                  <TableCell>
                    <AmountCell transaction={tx} />
                  </TableCell>
                </TableRow>
              );
            })}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
