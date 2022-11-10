/* eslint-disable radix */
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import api from 'services/api';
import useGetTPSByBlockHeight from './useGetTPSByBlockHeight';

export default function useGetTPS() {
  const [blockHeight, setBlockHeight] = useState<number | undefined>();
  const { tps } = useGetTPSByBlockHeight(blockHeight);

  const { data: ledgerData } = useQuery(
    [`ledgerInfo`],
    () => api.getLedgerInfo(),
    { refetchInterval: 10000 },
  );
  const currentBlockHeight = ledgerData?.block_height;

  useEffect(() => {
    if (currentBlockHeight !== undefined) {
      setBlockHeight(parseInt(currentBlockHeight));
    }
  }, [currentBlockHeight]);

  return { tps };
}
