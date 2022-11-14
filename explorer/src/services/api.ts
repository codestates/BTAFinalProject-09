import localnetApi from './localnetApi';
import testnetApi from './testnetApi';

const IS_TESTNET =
  typeof window !== `undefined` ? window.location.port === `3001` : false;

const api = IS_TESTNET ? testnetApi : localnetApi;

export default api;
