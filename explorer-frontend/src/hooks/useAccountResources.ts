import { Types } from 'aptos';
import { useQuery } from 'react-query';
import api from 'services/api';

export default function useAccountResources(address: string) {
  return useQuery<Array<Types.MoveResource>>(
    [`accountResources`, { address }],
    () => api.getAccountResources(address),
    { enabled: !!address },
  );
}
