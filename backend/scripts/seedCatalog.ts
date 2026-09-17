import bcrypt from 'bcryptjs';
import { connectDb, mongoose } from '../src/lib/db';
import { ensureDefaultAdmin } from '../src/lib/seedAdmin';
import { Vendor } from '../src/models/Vendor';
import { Category } from '../src/models/Category';
import { Product } from '../src/models/Product';
import { Coupon } from '../src/models/Coupon';

declare const process: {
  exitCode?: number;
};

/**
 * Dev-only convenience seed for the core-commerce domain (categories, an
 * approved demo vendor, products, a coupon) so the customer/vendor/admin apps
 * have real data to render instead of an empty catalog. Idempotent — safe to
 * re-run against the same database.
 */
async function main() {
  await connectDb();
  await ensureDefaultAdmin();

  const vendorPhone = '9876500001';
  let vendor = await Vendor.findOne({ phone: vendorPhone });
  if (!vendor) {
    vendor = await Vendor.create({
      phone: vendorPhone,
      email: 'demo.vendor@verdant.com',
      passwordHash: await bcrypt.hash('vendor@123', 10),
      fullName: 'Demo Vendor',
      status: 'active',
      kycStatus: 'verified',
      registrationStep: 'submitted',
      referenceId: 'VND-DEMO-0001',
      businessType: 'proprietorship',
      storeProfile: {
        storeName: 'Fresh Mart Koramangala',
        description: 'Your neighbourhood quick-commerce store',
        primaryCategory: 'Grocery',
        subCategory: 'Supermarket',
        tags: ['grocery', 'fresh'],
        minimumOrderValue: '99',
        avgPrepTime: '10',
      },
      storeSetupStep: 'complete',
      storeSetupCompletedAt: new Date(),
      storeStatus: 'open',
      storeStatusSetAt: new Date(),
    });
    console.log(`Created demo vendor ${vendor.phone} (password: vendor@123)`);
  }

  const categoryDefs = [
    { name: 'Fruits & Vegetables', slug: 'fruits-vegetables', subs: ['Fresh Fruits', 'Fresh Vegetables'] },
    { name: 'Dairy & Eggs', slug: 'dairy-eggs', subs: ['Milk', 'Eggs & Paneer'] },
    { name: 'Snacks & Beverages', slug: 'snacks-beverages', subs: ['Chips & Namkeen', 'Cold Drinks'] },
    { name: 'Household Essentials', slug: 'household-essentials', subs: ['Cleaning', 'Personal Care'] },
  ];

  const categories: Record<string, InstanceType<typeof Category>> = {};
  for (let i = 0; i < categoryDefs.length; i++) {
    const def = categoryDefs[i];
    let category = await Category.findOne({ slug: def.slug });
    if (!category) {
      category = await Category.create({
        name: def.name,
        slug: def.slug,
        sortOrder: i,
        isActive: true,
        showOnHome: true,
        subcategories: def.subs.map((name, idx) => ({ id: `${def.slug}-sub-${idx}`, name, isActive: true })),
      });
    }
    categories[def.slug] = category;
  }

  const productDefs = [
    { name: 'Fortune Sunflower Oil', category: 'household-essentials', sub: 0, tags: ['deal', 'essential'], variants: [{ id: 'v-500ml', label: '500 ml', mrp: 175, price: 148 }, { id: 'v-1l', label: '1 L', mrp: 320, price: 279 }] },
    { name: 'Amul Gold Full Cream Milk', category: 'dairy-eggs', sub: 0, tags: ['essential'], variants: [{ id: 'v-500ml', label: '500 ml', mrp: 35, price: 32 }] },
    { name: 'Farm Fresh Eggs (12 pack)', category: 'dairy-eggs', sub: 1, tags: ['essential', 'saver'], variants: [{ id: 'v-12pc', label: '12 pieces', mrp: 96, price: 89 }] },
    { name: 'Tata Salt', category: 'household-essentials', sub: 1, tags: ['saver', 'essential'], variants: [{ id: 'v-1kg', label: '1 kg', mrp: 25, price: 22 }] },
    { name: 'Fresh Bananas', category: 'fruits-vegetables', sub: 0, tags: ['deal'], variants: [{ id: 'v-1dz', label: '1 dozen', mrp: 60, price: 49 }] },
    { name: 'Fresh Tomatoes', category: 'fruits-vegetables', sub: 1, tags: ['deal', 'saver'], variants: [{ id: 'v-1kg', label: '1 kg', mrp: 40, price: 30 }] },
    { name: "Lay's Classic Salted Chips", category: 'snacks-beverages', sub: 0, tags: ['deal'], variants: [{ id: 'v-52g', label: '52 g', mrp: 20, price: 20 }] },
    { name: 'Coca-Cola', category: 'snacks-beverages', sub: 1, tags: ['saver'], variants: [{ id: 'v-750ml', label: '750 ml', mrp: 45, price: 40 }] },
  ];

  for (const def of productDefs) {
    const category = categories[def.category];
    const existing = await Product.findOne({ vendorId: vendor._id, name: def.name });
    if (existing) continue;
    await Product.create({
      vendorId: vendor._id,
      categoryId: category._id,
      subcategoryId: category.subcategories[def.sub]?.id,
      name: def.name,
      description: `${def.name} — fresh and delivered fast.`,
      unit: def.variants[0].label,
      images: [],
      variants: def.variants.map((v) => ({ ...v, stock: 100 })),
      tags: def.tags,
      taxRate: 5,
      status: 'active',
      isAvailable: true,
    });
  }

  const existingCoupon = await Coupon.findOne({ code: 'FRESH50' });
  if (!existingCoupon) {
    await Coupon.create({
      code: 'FRESH50',
      description: 'Flat ₹50 off on orders above ₹199',
      discountType: 'flat',
      value: 50,
      minOrderValue: 199,
      isActive: true,
    });
  }

  console.log('Catalog seed complete.');
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
