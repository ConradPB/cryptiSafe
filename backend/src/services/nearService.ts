import { connect, KeyPair, keyStores, utils, Near } from 'near-api-js';

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

  const initialBalanceStr = utils.format.parseNearAmount('1');
  if (!initialBalanceStr) {
    throw new Error('Failed to parse initial balance');
  }
  const initialBalance = BigInt(initialBalanceStr);

  await masterAccount.createAccount(
    accountId,
    publicKey,
    initialBalance
  );

  return {
    publicKey: newKeyPair.getPublicKey().toString(),
    secretKey: newKeyPair.secretKey // Correctly access the private key
  };
};

export const sendTransaction = async (senderId: string, receiverId: string, amount: string) => {
  const near = await initializeNear();
  const senderAccount = await near.account(senderId);

  const amountStr = utils.format.parseNearAmount(amount);
  if (!amountStr) {
    throw new Error('Failed to parse amount');
  }
  const parsedAmount = BigInt(amountStr);

  const result = await senderAccount.sendMoney(
    receiverId,
    parsedAmount
  );

  return result.transaction_outcome.id;
};
