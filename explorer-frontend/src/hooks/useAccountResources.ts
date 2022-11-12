import { useQuery } from 'react-query';
import api from 'services/api';
import { CoinStoreResource, TokenStoreResource } from 'types/aptos';

type ResourceResult = CoinStoreResource & TokenStoreResource;

export default function useAccountResources(address: string) {
  return useQuery<Array<ResourceResult>>(
    [`accountResources`, { address }],
    () => api.getAccountResources(address) as Promise<ResourceResult[]>,
    { enabled: !!address },
  );
}
