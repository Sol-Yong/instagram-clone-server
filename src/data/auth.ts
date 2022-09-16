import { model, Schema } from 'mongoose';
import { useVirtualId } from '../database/database';

export interface IUser {
  email: string;
  name: string;
  username: string;
  password: string;
}

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

useVirtualId(userSchema);
const User = model<IUser>('User', userSchema);

export async function findByEmail(email: string) {
  return User.findOne({ email });
}

export async function findByUsername(username: string) {
  return User.findOne({ username });
}

export async function findById(id: string) {
  return User.findById(id);
}

export async function createUser(user: IUser) {
  return new User(user).save().then((data) => data.id);
}
