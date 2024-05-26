import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  date: Date;
  nearAccountId: String;
  nearPrivateKey: String;

}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  nearAccountId: { type: String },
  nearPrivateKey: { type: String },
});

const User = model<IUser>('User', UserSchema);

export default User;
