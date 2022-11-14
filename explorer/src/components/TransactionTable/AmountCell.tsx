import Typography from '@mui/material/Typography';
import { Types } from 'aptos';
import getFormattedBalanceStr from '../../utils/getFormattedBalanceStr';
import getTransactionAmount from '../../utils/getTranscationAmount';

interface AmountCellProps {
  transaction: Types.Transaction;
}

export default function AmountCell({ transaction, ...props }: AmountCellProps) {
  const amount = getTransactionAmount(transaction);

  if (!amount) {
    return null;
  }

  const formatted = getFormattedBalanceStr(amount.toString());

  return <Typography {...props}>{formatted} APT</Typography>;
}
