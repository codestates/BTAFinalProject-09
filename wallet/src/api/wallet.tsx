import { AptosClient, FaucetClient, TokenClient, TxnBuilderTypes, AptosAccount } from "aptos";
import { HexString, MaybeHexString } from "aptos";
import * as Gen from 'aptos/src/generated/index';
import common from '../common';

const COIN_TYPE = 637;
const MAX_ACCOUNTS = 10;
const ADDRESS_GAP = 10;
const coinTransferFunction = "0x1::aptos_account::transfer";
const bip39 = require('bip39');

export interface AccountMetaData {
    derivationPath: string;
    address: string;
    publicKey?: string;
    privateKey: string;
}

export interface Wallet {
  code: string; // mnemonic
  accounts: AccountMetaData[];
}

export class WalletClient 
{
    faucetClient: FaucetClient;
    aptosClient: AptosClient;
    tokenClient: TokenClient;
    static APTOS_DECIMALS:number = 8;
    

    //퍼블릿 까지 알고있을때만 가능 함 -> address부분 정확히 복구
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
    // 음 설정 쿼리 옵션좀 건드려야함 
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

  //트랜잭션 조회
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
  
static trimRight(rightSide: string) {
  while (rightSide.endsWith(`0`)) {
    rightSide = rightSide.slice(0, -1);
  }
  return rightSide;
}
//밸런스조절
static getFormattedBalanceStr(balance: string, decimals?: number, fixedDecimalPlaces?: number,): string {
  if (balance == `0`) {
    return balance;
  }

  const len = balance.length;
  decimals = decimals || this.APTOS_DECIMALS;

  if (len <= decimals) {
    return `0.${this.trimRight(`0`.repeat(decimals - len) + balance) || `0`}`;
  }

  const leftSide = BigInt(balance.slice(0, len - decimals)).toLocaleString(
    `en-US`,
  );
  let rightSide = balance.slice(len - decimals);
  if (BigInt(rightSide) == BigInt(0)) {
    return leftSide;
  }

  rightSide = this.trimRight(rightSide);
  if (
    fixedDecimalPlaces !== undefined &&
    rightSide.length > fixedDecimalPlaces
  ) {
    rightSide = rightSide.slice(0, fixedDecimalPlaces - rightSide.length);
  }

  if (rightSide.length === 0) {
    return leftSide;
  }

  return `${leftSide}.${this.trimRight(rightSide)}`;
}
// faucet
async airdrop(address: string, amount: number) {
  return Promise.resolve(
    await this.faucetClient.fundAccount(address, amount)
  );
}

//지갑 생성 
async createWallet(mnemonic?:string): Promise<Wallet> {
  const code = mnemonic || bip39.generateMnemonic(); // mnemonic
  const accountMetadata = await this.createNewAccount(code);
  return { code, accounts: [accountMetadata] };
}

// 지갑에서 계정 생성 순차적으로 실행 
async createNewAccount(code: string): Promise<AccountMetaData> {
  for (let i = 0; i < MAX_ACCOUNTS; i += 1) {
   
    const derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0'/0'`;
    const account = AptosAccount.fromDerivePath(derivationPath, code);
    const address = HexString.ensure(account.address()).toShortString();
    const response = await fetch(
      `${this.aptosClient.nodeUrl}/accounts/${address}`,
      {
        method: "GET",
      }
    );
    if (response.status === 404) {
      await this.faucetClient.fundAccount(address, 0);
      return {
        derivationPath,
        address,
        publicKey: account.pubKey().toString(),
        privateKey: account.toPrivateKeyObject().privateKeyHex,
      };
    }
  
  }
  throw new Error("Max Account!!");
}

// 니모닉 코드에 순차적으로 계정 연결
async importWallet(code: string): Promise<Wallet> {
  let flag = false;
  let address = "";
  let publicKey = "";
  let derivationPath = "";
  let authKey = "";
  let privateKey ="";

  const accountMetaData: AccountMetaData[] = [];
  for (let i = 0; i < MAX_ACCOUNTS; i += 1) {
    flag = false;
    address = "";
    publicKey = "";
    derivationPath = "";
    authKey = "";
    privateKey ="";
    for (let j = 0; j < ADDRESS_GAP; j += 1) {

      derivationPath = `m/44'/${COIN_TYPE}'/${i}'/0'/${j}'`;
      const account = AptosAccount.fromDerivePath(derivationPath, code);
     
      if (j === 0) {
        address = HexString.ensure(account.address()).toShortString();
        publicKey = account.pubKey().toString();
        privateKey = account.toPrivateKeyObject().privateKeyHex;

        const response = await fetch(
          `${this.aptosClient.nodeUrl}/accounts/${address}`,
          {
            method: "GET",
          }
        );
        if (response.status === 404) {
        
          if (i === 0) {
            flag = true;
  
            await this.createNewAccount(code);
          }
          break;
        }
        const respBody = await response.json();
        authKey = respBody.authentication_key;
      }
      if (
        account.authKey().toShortString() === authKey ||
        account.authKey().toString() === authKey
      ) {
        flag = true;
        break;
      }
  
    }
    if (!flag) {
      break;
    }
    accountMetaData.push({
      derivationPath,
      address,
      publicKey,
      privateKey,
    });
  }
  return { code, accounts: accountMetaData };
}



}