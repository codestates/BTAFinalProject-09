import Chip, { ChipProps } from '@mui/material/Chip';
import { Types } from 'aptos';

interface FunctionCellProps extends ChipProps {
  transaction: Types.Transaction;
}

export default function FunctionCell({
  transaction,
  ...props
}: FunctionCellProps) {
  if (!(`payload` in transaction) || !(`function` in transaction.payload)) {
    return null;
  }

  const functionFullStr = transaction.payload.function;

  if (
    functionFullStr === `0x1::coin::transfer` ||
    functionFullStr === `0x1::aptos_account::transfer`
  ) {
    return <Chip label={functionFullStr} {...props} />;
  }

  const functionStrStartIdx = functionFullStr.indexOf(`::`) + 2;
  const functionStr = functionFullStr.substring(functionStrStartIdx);

  return <Chip label={functionStr} {...props} />;
}
