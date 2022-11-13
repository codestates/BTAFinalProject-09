import { Types } from 'aptos';
import { useQuery } from 'react-query';
import api from 'services/api';

export function useGetBlockByHeight({
  height,
  withTransactions = true,
}: {
  height: number | undefined;
  withTransactions?: boolean;
}) {
  const result = useQuery<Types.Block>(
    [`block`, { height }],
    () => api.getBlockByHeight(height || 0, withTransactions),
    { enabled: height !== undefined },
  );

  return result;
}

export function useGetBlockByVersion({
  version,
  withTransactions = true,
}: {
  version: number | undefined;
  withTransactions?: boolean;
}) {
  const result = useQuery<Types.Block>(
    [`block`, { version }],
    () => api.getBlockByVersion(version, withTransactions),
    { enabled: version !== undefined },
  );

  return result;
}
