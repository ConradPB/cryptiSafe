import { Request, Response } from 'express';
import { sendTransaction } from '../services/nearService.js';
import { createAccount } from '../services/createAccount.js';

export const createNearAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.body;
    if (!accountId) {
      return res.status(400).json({ msg: 'Account ID is required' });
    }

    const privateKey = await createAccount(accountId);
    return res.status(200).json({ msg: 'Account created', privateKey });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export const sendNearTransaction = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    if (!senderId || !receiverId || !amount) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const transactionId = await sendTransaction(senderId, receiverId, amount);
    return res.status(200).json({ msg: 'Transaction successful', transactionId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};
