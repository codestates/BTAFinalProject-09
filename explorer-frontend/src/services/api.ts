import { AptosClient } from 'aptos';

interface PaginationArgs {
  start?: number;
  limit?: number;
}

const api = {
  nodeUrl: `https://fullnode.devnet.aptoslabs.com/v1`,
  async getTransactions(args: PaginationArgs) {
    const client = new AptosClient(this.nodeUrl);
    return client.getTransactions(args);
  },
};

export default api;
