import { Types } from 'aptos';
import { useQuery } from 'react-query';
import api from 'services/api';
import { CoinStoreResource } from 'types/aptos';

type ResourceResult = Types.MoveResource & CoinStoreResource;

export default function useAccountResources(address: string) {
  return useQuery<Array<ResourceResult>>(
    [`accountResources`, { address }],
    () => api.getAccountResources(address) as ResourceResult[],
    { enabled: !!address },
  );
}
