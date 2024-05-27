import { connect, KeyPair, keyStores, utils, Near } from 'near-api-js';
import BN from 'bn.js';

const keyStore = new keyStores.InMemoryKeyStore();
const nearConfig = {
  networkId: process.env.NEAR_NETWORK!,
  keyStore,
  nodeUrl: process.env.NEAR_NODE_URL!,
  walletUrl: process.env.NEAR_WALLET_URL!,
  helperUrl: process.env.NEAR_HELPER_URL!,
  explorerUrl: process.env.NEAR_EXPLORER_URL!
};

export const initializeNear = async (): Promise<Near> => {
  const near = await connect(nearConfig);
  return near;
};

export const createAccount = async (accountId: string) => {
  const near = await initializeNear();
  const masterAccount = await near.account(process.env.NEAR_MASTER_ACCOUNT!);

  const newKeyPair = KeyPair.fromRandom('ed25519');
  const publicKey = newKeyPair.getPublicKey().toString();

  // Set the key pair in the key store
  await keyStore.setKey(nearConfig.networkId, accountId, newKeyPair);

  const initialBalance = new BN(utils.format.parseNearAmount('1')!);  // Initial balance in NEAR tokens

  await masterAccount.createAccount(
    accountId,
    publicKey,
    initialBalance
  );

  return {
    publicKey: newKeyPair.getPublicKey().toString(),
    secretKey: newKeyPair.secretKey
  };
};

export const sendTransaction = async (senderId: string, receiverId: string, amount: string) => {
  const near = await initializeNear();
  const senderAccount = await near.account(senderId);

  const result = await senderAccount.sendMoney(
    receiverId,
    new BN(utils.format.parseNearAmount(amount)!)
  );

  return result.transaction_outcome.id;
};
