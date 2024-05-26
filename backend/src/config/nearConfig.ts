
import { connect, KeyPair, keyStores, Near } from 'near-api-js';
import dotenv from 'dotenv';

dotenv.config();

const nearConfig = {
  networkId: process.env.NEAR_NETWORK!,
  nodeUrl: process.env.NEAR_NODE_URL!,
  walletUrl: process.env.NEAR_WALLET_URL!,
  helperUrl: process.env.NEAR_HELPER_URL!,
  explorerUrl: process.env.NEAR_EXPLORER_URL!,
  keyStore: new keyStores.InMemoryKeyStore(),
};

export const initializeNear = async () => {
  const keyStore = new keyStores.InMemoryKeyStore();
  const keyPair = KeyPair.fromString(process.env.NEAR_PRIVATE_KEY!);
  await keyStore.setKey(nearConfig.networkId, process.env.NEAR_MASTER_ACCOUNT!, keyPair);

  return await connect({
    ...nearConfig,
    keyStore,
  });
};
