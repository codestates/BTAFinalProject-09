import { AptosClient, FaucetClient, TokenClient, TxnBuilderTypes, AptosAccount } from "aptos";
import { HexString, MaybeHexString } from "aptos";
import * as Gen from 'aptos/src/generated/index';
import common from '../common';

const COIN_TYPE = 637;
const MAX_ACCOUNTS = 20;
const ADDRESS_GAP = 10;
const coinTransferFunction = "0x1::aptos_account::transfer";

export interface AccountMetaData {
    derivationPath: string;
    address: string;
    publicKey?: string;
}


export class WalletClient {
    faucetClient: FaucetClient;
    aptosClient: AptosClient;
    tokenClient: TokenClient;

    //퍼블릿 까지 알고있을때만 가능 함 -> address부분 정확히 복구는 안되는듯함?
    static getAccountFromPrivateKey(privateKey: string, address?: string) {
        const privateKeyBytes = new HexString(privateKey).toUint8Array();
        return new AptosAccount(privateKeyBytes);
    }
    
     
    static getAccountFromMnemonic(code: string) {
        return AptosAccount.fromDerivePath(`m/44'/${COIN_TYPE}'/0'/0'/0'`, code);
    }

    constructor(node_url: string, faucet_url: string) {
        this.faucetClient = new FaucetClient(node_url, faucet_url);
        this.aptosClient = new AptosClient(node_url);
        this.tokenClient = new TokenClient(this.aptosClient);
    }
  
    async getBalance(address: MaybeHexString) {
        let balance = 0;
        try{
          const resources: any = await this.aptosClient.getAccountResources(address);
          Object.values(resources).forEach((value: any) => {
              if (value.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>") {
                  balance = Number(value.data.coin.value);
              }
          });
          return Promise.resolve(balance);
        }catch(err){
          return Promise.resolve(0);
        }
    }

  // 트랜잭션 가스 추정
  async estimateGasFees(account:AptosAccount, transaction: TxnBuilderTypes.RawTransaction): Promise<string> {
    const simulateResponse: any = await this.aptosClient.simulateTransaction(
      account,
      transaction
    );
    return (
      parseInt(simulateResponse[0].gas_used, 10) *
      parseInt(simulateResponse[0].gas_unit_price, 10)
    ).toString();
  }

  //코인 전송 
  async transfer(account: AptosAccount, recipient_address: string | HexString, amount: number) {
    try {
      if (recipient_address.toString() === account.address().toString()) {
        return new Error("cannot transfer coins to self");
      }

      const payload: Gen.EntryFunctionPayload = {
        function: coinTransferFunction,
        type_arguments: [],
        arguments: [recipient_address, amount],
      };

      const rawTxn: TxnBuilderTypes.RawTransaction = await this.aptosClient.generateTransaction(account.address(), payload);

      const signedTxn: Uint8Array = await this.aptosClient.signTransaction(
        account,
        rawTxn
      );
      const transaction: Gen.PendingTransaction = await this.aptosClient.submitTransaction(signedTxn);
      await this.aptosClient.waitForTransaction(transaction.hash);
      
      return await Promise.resolve(transaction.hash);
    } catch (err) {
      chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
            title: 'Apcellent',
            message: 'Transaction Failed !!',
            iconUrl: '/logo192.png',
            type: 'basic'
        }
      });
      return Promise.reject(err);
    }
  }

  //코인 전송 시뮬레이션1

  //코인 전송 시뮬레이션2
  async transfer_simulation(account: AptosAccount, recipient_address: string | HexString, amount: number): Promise<string> 
  {
    const payload: Gen.EntryFunctionPayload = {
      function: coinTransferFunction,
      type_arguments: [],
      arguments: [recipient_address, amount],
    };
    // 오차가 아주 약간 있음!!... 
    const rawTxn: TxnBuilderTypes.RawTransaction = await this.aptosClient.generateTransaction(account.address(), payload);
    const simulateResponse: any = await this.aptosClient.simulateTransaction(
      account,
      rawTxn,
      {
        estimateGasUnitPrice : true,
        estimateMaxGasAmount : true,
        estimatePrioritizedGasUnitPrice :false
      }
    );
    console.log(simulateResponse)
    return (parseInt(simulateResponse[0].gas_used, 10) * parseInt(simulateResponse[0].gas_unit_price, 10)).toString();
  }

  //get transcations 
  async accountTransactions(accountAddress: MaybeHexString) {
    const data = await this.aptosClient.getAccountTransactions(accountAddress);
    const transactions = data.map((item: any) => ({
      data: item.payload,
      from: item.sender,
      gas: item.gas_used,
      gasPrice: item.gas_unit_price,
      hash: item.hash,
      success: item.success,
      timestamp: item.timestamp,
      toAddress: item.payload.arguments[0],
      price: item.payload.arguments[1],
      type: item.type,
      version: item.version,
      vmStatus: item.vm_status,
    }));
    return transactions;
  }




}