import mongoose, { Document, Schema } from 'mongoose';

export interface IConnection extends Document {
  user: mongoose.Schema.Types.ObjectId;
  connection: mongoose.Schema.Types.ObjectId;
  status: 'ignored' | 'interested' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new mongoose.Schema<IConnection>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId as unknown as Schema.Types.String,
      ref: 'User',
      required: true,
    },
    connection: {
      type: mongoose.Schema.Types.ObjectId as unknown as Schema.Types.String,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
  },
  { timestamps: true }
);

export const Connection = mongoose.model<IConnection>(
  'Connection',
  connectionSchema
);
