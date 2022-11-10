import { AptosClient, Types } from 'aptos';

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
  async getLedgerInfo() {
    const client = new AptosClient(this.nodeUrl);
    return client.getLedgerInfo();
  },
  async getAccountResources(address: string) {
    const client = new AptosClient(this.nodeUrl);
    return client.getAccountResources(address);
  },
  async getTableItem(tableHandle: string, data: Types.TableItemRequest) {
    const client = new AptosClient(this.nodeUrl);
    return client.getTableItem(tableHandle, data);
  },
  async getBlockByHeight(
    height: number,
    withTransactions: boolean,
  ): Promise<Types.Block> {
    const client = new AptosClient(this.nodeUrl);
    return client.getBlockByHeight(height, withTransactions);
  },
  async getBlockByVersion(
    version: number,
    withTransactions: boolean,
  ): Promise<Types.Block> {
    const client = new AptosClient(this.nodeUrl);
    return client.getBlockByVersion(version, withTransactions);
  },
};

export default api;
