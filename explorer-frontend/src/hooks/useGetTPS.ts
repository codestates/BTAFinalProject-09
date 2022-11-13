/* eslint-disable radix */
import { useEffect, useState } from 'react';
import useGetTPSByBlockHeight from './useGetTPSByBlockHeight';
import useLedgerInfo from './useLedgerInfo';

export default function useGetTPS() {
  const [blockHeight, setBlockHeight] = useState<number | undefined>();
  const { tps } = useGetTPSByBlockHeight(blockHeight);

  const { data: ledgerData } = useLedgerInfo({ refetchInterval: 10000 });
  const currentBlockHeight = ledgerData?.block_height;

  useEffect(() => {
    if (currentBlockHeight !== undefined) {
      setBlockHeight(parseInt(currentBlockHeight));
    }
  }, [currentBlockHeight]);

  return { tps };
}
