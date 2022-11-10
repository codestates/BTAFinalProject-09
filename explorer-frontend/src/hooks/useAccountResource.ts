import { Types } from 'aptos';
import { useQuery, UseQueryResult } from 'react-query';
import api from '../services/api';

type GetAccountResourceResponse = {
  accountResource: Types.MoveResource | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<UseQueryResult>;
};

export default function useAccountResource(
  address: string,
  resource: string,
): GetAccountResourceResponse {
  const { isLoading, isError, refetch, data } = useQuery<
    Array<Types.MoveResource>
  >([`accountResource`, { address }], () => api.getAccountResources(address), {
    refetchOnWindowFocus: false,
  });

  const accountResource = data?.find((r) => r.type === resource);

  return { accountResource, isLoading, isError, refetch };
}
