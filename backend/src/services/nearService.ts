import { connect, KeyPair, keyStores, utils, Near } from 'near-api-js';
import { initializeNear } from '../config/nearConfig.js';
import BN from 'bn.js';

export const createAccount = async (accountId: string) => {
  const near = await initializeNear();
  const masterAccount = await near.account(process.env.NEAR_MASTER_ACCOUNT!);

  const newKeyPair = KeyPair.fromRandom('ed25519');
  const publicKey = newKeyPair.getPublicKey().toString();

  const initialBalance = new BN(utils.format.parseNearAmount('1')!);  // Initial balance in NEAR tokens

  await masterAccount.createAccount(
    accountId,
    publicKey,
    initialBalance
  );

  return newKeyPair.toString(); // Returns the key pair string
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
