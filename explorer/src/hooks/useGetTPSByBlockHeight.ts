import { useEffect, useState } from 'react';
import { Types } from 'aptos';
import parseTimestamp from 'utils/parseTimestamp';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { useGetBlockByHeight } from './useGetBlock';

dayjs.extend(durationPlugin);

const TPS_FREQUENCY = 600;

function calculateTps(startBlock: Types.Block, endBlock: Types.Block): number {
  const startTransactionVersion = parseInt(startBlock.last_version, 10);
  const endTransactionVersion = parseInt(endBlock.last_version, 10);

  const startTimestamp = parseTimestamp(startBlock.block_timestamp);
  const endTimestamp = parseTimestamp(endBlock.block_timestamp);
  const duration = dayjs.duration(endTimestamp.diff(startTimestamp));
  const durationInSec = duration.asSeconds();

  return (endTransactionVersion - startTransactionVersion) / durationInSec;
}

export default function useGetTPSByBlockHeight(
  currentBlockHeight: number | undefined,
) {
  const [tps, setTps] = useState<number | null>(null);

  const { data: startBlock } = useGetBlockByHeight({
    height: currentBlockHeight && currentBlockHeight - TPS_FREQUENCY,
    withTransactions: false,
  });
  const { data: endBlock } = useGetBlockByHeight({
    height: currentBlockHeight,
    withTransactions: false,
  });

  useEffect(() => {
    if (startBlock !== undefined && endBlock !== undefined) {
      setTps(calculateTps(startBlock, endBlock));
    }
  }, [startBlock, endBlock]);

  return { tps };
}
