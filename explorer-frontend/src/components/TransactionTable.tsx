import { FC, PropsWithChildren } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Types } from 'aptos';
import dayjs from 'dayjs';
import getTransactionCounterparty from '../utils/getTransactionCounterParty';
import truncateAddress from '../utils/truncateAddress';
import ensureMillisecondTimestamp from '../utils/ensureMillisecondTimestamp';
import FunctionCell from './TransactionTable/FunctionCell';
import AmountCell from './TransactionTable/AmountCell';

interface TransactionTableProps extends PropsWithChildren {
  transactions: Types.Transaction[];
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
        {transactions.map((tx) => {
          const receiverOrCounterparty = getTransactionCounterparty(tx);
          return (
            <TableRow key={tx.hash}>
              <TableCell>{`version` in tx ? tx.version : `-`}</TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell>
                {`timestamp` in tx
                  ? dayjs(ensureMillisecondTimestamp(tx.timestamp)).format(
                      `YYYY-MM-DD HH:mm:ss`,
                    )
                  : ``}
              </TableCell>
              <TableCell>
                {`sender` in tx ? truncateAddress(tx.sender) : ``}
              </TableCell>
              <TableCell>
                {receiverOrCounterparty
                  ? truncateAddress(receiverOrCounterparty.address)
                  : ``}
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
