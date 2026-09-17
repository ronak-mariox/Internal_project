import { Schema, model } from 'mongoose';

export interface SubcategoryItem {
  id: string;
  name: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface CategoryDoc {
  _id: unknown;
  name: string;
  slug: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  showOnHome: boolean;
  subcategories: SubcategoryItem[];
  createdAt: Date;
  updatedAt: Date;
}

const subcategorySchema = new Schema<SubcategoryItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: String,
    isActive: { type: Boolean, default: true },
  },
  { _id: false },
);

const categorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    imageUrl: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    showOnHome: { type: Boolean, default: true },
    subcategories: { type: [subcategorySchema], default: [] },
  },
  { timestamps: true },
);

categorySchema.index({ sortOrder: 1 });

export const Category = model<CategoryDoc>('Category', categorySchema);
