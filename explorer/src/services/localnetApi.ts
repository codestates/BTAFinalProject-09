import { AptosClient, Types } from 'aptos';

interface PaginationArgs {
  start?: number;
  limit?: number;
}

const localnetApi = {
  nodeUrl: `http://localhost:8080/v1`,
  async getTransactions(args: PaginationArgs) {
    const client = new AptosClient(this.nodeUrl);
    const txs = await client.getTransactions(args);
    return txs.reverse();
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
  async getTransactionByVersion(version: number): Promise<Types.Transaction> {
    const client = new AptosClient(this.nodeUrl);
    return client.getTransactionByVersion(BigInt(version));
  },
  async getTransactionByHash(hash: string): Promise<Types.Transaction> {
    const client = new AptosClient(this.nodeUrl);
    return client.getTransactionByHash(hash);
  },
  async getAccountTransactions(address: string, args: PaginationArgs) {
    const client = new AptosClient(this.nodeUrl);
    const txs = await client.getAccountTransactions(address, args);
    return txs.reverse();
  },
  async getAccount(address: string) {
    const client = new AptosClient(this.nodeUrl);
    return client.getAccount(address);
  },
  async getRecentBlocks(
    currentBlockHeight: number,
    count: number,
  ): Promise<Types.Block[]> {
    const client = new AptosClient(this.nodeUrl);
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const block = await client.getBlockByHeight(
        currentBlockHeight - i,
        false,
      );
      blocks.push(block);
    }
    return blocks;
  },
};

export default localnetApi;
