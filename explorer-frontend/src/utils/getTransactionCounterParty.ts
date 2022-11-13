import { Types } from 'aptos';

export type TransactionCounterparty = {
  address: string;
  role: 'receiver' | 'smartContract';
};
export default function getTransactionCounterparty(
  transaction: Types.Transaction,
): TransactionCounterparty | undefined {
  if (transaction.type !== `user_transaction`) {
    return undefined;
  }

  if (!(`payload` in transaction)) {
    return undefined;
  }

  if (transaction.payload.type !== `entry_function_payload`) {
    return undefined;
  }

  const payload =
    transaction.payload as Types.TransactionPayload_EntryFunctionPayload;
  const typeArgument =
    payload.type_arguments.length > 0 ? payload.type_arguments[0] : undefined;
  const isAptCoinTransfer =
    payload.function === `0x1::coin::transfer` &&
    typeArgument === `0x1::aptos_coin::AptosCoin`;
  const isAptCoinInitialTransfer =
    payload.function === `0x1::aptos_account::transfer`;

  if (
    (isAptCoinTransfer || isAptCoinInitialTransfer) &&
    payload.arguments.length === 2
  ) {
    return {
      address: payload.arguments[0],
      role: `receiver`,
    };
  }
  const smartContractAddr = payload.function.split(`::`)[0];
  return {
    address: smartContractAddr,
    role: `smartContract`,
  };
}
