import { Types } from 'aptos';
import { useQuery } from 'react-query';
import api from 'services/api';

export default function useAccount(address: string) {
  const result = useQuery<Types.AccountData>(
    [`account`, { address }],
    () => api.getAccount(address),
    { enabled: !!address },
  );

  return result;
}
