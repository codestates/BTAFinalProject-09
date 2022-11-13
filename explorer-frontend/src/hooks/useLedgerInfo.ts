import { Types } from 'aptos';
import { useQuery } from 'react-query';
import api from 'services/api';

export default function useLedgerInfo(options?: { refetchInterval: number }) {
  const result = useQuery<Types.IndexResponse>(
    [`ledgerInfo`],
    () => api.getLedgerInfo(),
    options,
  );

  return result;
}
