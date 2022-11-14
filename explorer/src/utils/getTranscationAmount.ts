/* eslint-disable no-param-reassign */
import { Types } from 'aptos';

type ChangeData = {
  coin: { value: string };
  deposit_events: {
    guid: {
      id: {
        addr: string;
        creation_num: string;
      };
    };
  };
  withdraw_events: {
    guid: {
      id: {
        addr: string;
        creation_num: string;
      };
    };
  };
};

function getAptChangeData(
  change: Types.WriteSetChange,
): ChangeData | undefined {
  if (
    `address` in change &&
    `data` in change &&
    `type` in change.data &&
    change.data.type === `0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>` &&
    `data` in change.data
  ) {
    return JSON.parse(JSON.stringify(change.data.data)) as ChangeData;
  }
  return undefined;
}

function isAptEvent(event: Types.Event, transaction: Types.Transaction) {
  const changes: Types.WriteSetChange[] =
    `changes` in transaction ? transaction.changes : [];

  const aptEventChange = changes.filter((change) => {
    if (`address` in change && change.address === event.guid.account_address) {
      const data = getAptChangeData(change);
      if (data !== undefined) {
        const eventCreationNum = event.guid.creation_number;
        let changeCreationNum;
        if (event.type === `0x1::coin::DepositEvent`) {
          changeCreationNum = data.deposit_events.guid.id.creation_num;
        } else if (event.type === `0x1::coin::WithdrawEvent`) {
          changeCreationNum = data.withdraw_events.guid.id.creation_num;
        }
        if (eventCreationNum === changeCreationNum) {
          return change;
        }
      }
    }
  });

  return aptEventChange.length > 0;
}

function getBalanceMap(transaction: Types.Transaction) {
  const events: Types.Event[] =
    `events` in transaction ? transaction.events : [];

  const accountToBalance = events.reduce(
    (
      balanceMap: {
        [key: string]: {
          amountAfter: string;
          amount: bigint;
        };
      },
      event: Types.Event,
    ) => {
      const addr = event.guid.account_address;

      if (
        event.type === `0x1::coin::DepositEvent` ||
        event.type === `0x1::coin::WithdrawEvent`
      ) {
        if (isAptEvent(event, transaction)) {
          if (!balanceMap[addr]) {
            balanceMap[addr] = { amount: BigInt(0), amountAfter: `` };
          }

          const amount = BigInt(event.data.amount);

          if (event.type === `0x1::coin::DepositEvent`) {
            balanceMap[addr].amount += amount;
          } else {
            balanceMap[addr].amount -= amount;
          }
        }
      }

      return balanceMap;
    },
    {},
  );

  return accountToBalance;
}

export default function getTransactionAmount(
  transaction: Types.Transaction,
): bigint | undefined {
  if (transaction.type !== `user_transaction`) {
    return undefined;
  }

  const accountToBalance = getBalanceMap(transaction);

  const [totalDepositAmount, totalWithdrawAmount] = Object.values(
    accountToBalance,
  ).reduce(
    ([totalDepositAmt, totalWithdrawAmt]: bigint[], value) => {
      if (value.amount > 0) {
        totalDepositAmt += value.amount;
      }
      if (value.amount < 0) {
        totalWithdrawAmt -= value.amount;
      }
      return [totalDepositAmt, totalWithdrawAmt];
    },
    [BigInt(0), BigInt(0)],
  );

  return totalDepositAmount > totalWithdrawAmount
    ? totalDepositAmount
    : totalWithdrawAmount;
}
