import { connect } from 'mongoose';
import { config } from '../config';

export async function connectDB() {
  return connect(config.db.host);
}
