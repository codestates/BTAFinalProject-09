import { Types } from 'aptos';
import { useQuery } from 'react-query';
import api from 'services/api';

export function useGetBlockByHeight({
  height,
  withTransactions = true,
}: {
  height: number;
  withTransactions?: boolean;
}) {
  const result = useQuery<Types.Block>([`block`, { height }], () =>
    api.getBlockByHeight(height, withTransactions),
  );

  return result;
}

export function useGetBlockByVersion({
  version,
  withTransactions = true,
}: {
  version: number;
  withTransactions?: boolean;
}) {
  const result = useQuery<Types.Block>([`block`, { version }], () =>
    api.getBlockByVersion(version, withTransactions),
  );

  return result;
}
