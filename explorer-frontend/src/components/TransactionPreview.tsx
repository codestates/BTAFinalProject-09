import { FC } from 'react';
import { useQuery } from 'react-query';
import api from '../services/api';
import TransactionTable from './TransactionTable';

const PREVIEW_LIMIT = 10;

const TransactionPreview: FC = () => {
  const limit = PREVIEW_LIMIT;
  const { data } = useQuery([`transactions`, { limit }], () =>
    api.getTransactions({ limit }),
  );

  return <TransactionTable transactions={data} />;
};

export default TransactionPreview;
