import { connect, ObjectId, Schema } from 'mongoose';
import { config } from '../config';

export async function connectDB() {
  return connect(config.db.host);
}

export function useVirtualId(schema: Schema) {
  // _id -> id
  schema.virtual('id').get(function () {
    const _id = this._id as ObjectId;
    return _id.toString();
  });
  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });
}
