import { connect, KeyPair, keyStores, transactions, utils, Contract } from 'near-api-js';
import { initializeNear } from '../config/nearConfig.js';

export const createAccount = async (accountId: string) => {
  const near = await initializeNear();
  const masterAccount = await near.account(process.env.NEAR_MASTER_ACCOUNT!);

  const newKeyPair = KeyPair.fromRandom('ed25519');
  const publicKey = newKeyPair.publicKey.toString();

  await masterAccount.createAccount(
    accountId,
    publicKey,
    utils.format.parseNearAmount('1') // Initial balance in NEAR tokens
  );

  return newKeyPair.secretKey;
};

export const sendTransaction = async (senderId: string, receiverId: string, amount: string) => {
  const near = await initializeNear();
  const senderAccount = await near.account(senderId);

  const result = await senderAccount.sendMoney(
    receiverId,
    utils.format.parseNearAmount(amount)
  );

  return result.transaction_outcome.id;
};
