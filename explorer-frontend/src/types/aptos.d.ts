export interface BaseResource {
  type: string;
  data: unknown;
}

export interface CoinStoreResource extends BaseResource {
  data?: {
    coin: {
      value: string;
    };
  };
}

export interface TokenStoreResource extends BaseResource {
  data?: {
    tokens: {
      handle: string;
    };
    deposit_events: {
      counter: string;
      guid: {
        id: {
          addr: string;
          creation_num: string;
        };
      };
    }[];
  };
}
