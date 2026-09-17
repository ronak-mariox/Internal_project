import { Schema, model } from 'mongoose';

export interface CustomerDoc {
  _id: unknown;
  phone: string;
  name?: string;
  email?: string;
  dob?: string; // ISO date string (YYYY-MM-DD), set via a real date picker client-side
  gender?: 'female' | 'male' | 'other';
  avatarUrl?: string;
  status: 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<CustomerDoc>(
  {
    phone: { type: String, required: true, unique: true },
    name: String,
    email: String,
    dob: String,
    gender: { type: String, enum: ['female', 'male', 'other'] },
    avatarUrl: String,
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  },
  { timestamps: true },
);

export const Customer = model<CustomerDoc>('Customer', customerSchema);
