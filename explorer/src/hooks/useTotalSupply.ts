import { Types } from 'aptos';
import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import useAccountResource from './useAccountResource';

interface AggregatorData {
  handle: string;
  key: string;
  limit: string;
}

interface CoinInfo {
  decimals: number;
  name: string;
  supply: {
    vec: [
      {
        aggregator: {
          vec: [AggregatorData];
        };
        integer: {
          vec: [];
        };
      },
    ];
  };
  symbol: string;
}

export default function useTotalSupply() {
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const { accountResource } = useAccountResource(
    `0x1`,
    `0x1::coin::CoinInfo<0x1::aptos_coin::AptosCoin>`,
  );

  const aggregatorData = useMemo(() => {
    const coinInfo = accountResource?.data as CoinInfo;
    return coinInfo?.supply?.vec[0]?.aggregator?.vec[0];
  }, [accountResource?.data]);

  const getTotalSupply = useCallback(async () => {
    if (!aggregatorData) {
      return;
    }

    const tableItemRequest = {
      key_type: `address`,
      value_type: `u128`,
      key: aggregatorData.key,
    } as Types.TableItemRequest;

    const supplyLimit = await api.getTableItem(
      aggregatorData.handle,
      tableItemRequest,
    );

    setTotalSupply(supplyLimit);
  }, [aggregatorData]);

  useEffect(() => {
    getTotalSupply();
  }, [getTotalSupply]);

  return totalSupply;
}
