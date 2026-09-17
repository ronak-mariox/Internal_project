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

  // This taxonomy (slugs + subcategory ids) matches Verdant's bundled category
  // illustration set exactly (see Verdant/src/data/categories.ts and
  // Verdant/src/utils/categoryIcon.ts) so seeded categories render their real icons
  // instead of falling back to a generic placeholder.
  const categoryDefs = [
    {
      name: 'Grocery',
      slug: 'grocery',
      subs: [
        { id: 'fruits-vegetables', name: 'Fruits & Vegetables' },
        { id: 'dairy-breakfast', name: 'Dairy & Breakfast' },
        { id: 'staples', name: 'Staples' },
        { id: 'bakery', name: 'Bakery' },
        { id: 'frozen-foods', name: 'Frozen Foods' },
      ],
    },
    {
      name: 'Snacks & Beverages',
      slug: 'snacks',
      subs: [
        { id: 'chips-snacks', name: 'Chips & Snacks' },
        { id: 'chocolates', name: 'Chocolates' },
        { id: 'soft-drinks', name: 'Soft Drinks' },
        { id: 'juices', name: 'Juices' },
        { id: 'tea-coffee', name: 'Tea & Coffee' },
      ],
    },
    {
      name: 'Personal Care',
      slug: 'personal-care',
      subs: [
        { id: 'bath-body', name: 'Bath & Body' },
        { id: 'hair-care', name: 'Hair Care' },
        { id: 'oral-care', name: 'Oral Care' },
        { id: 'grooming', name: 'Grooming' },
      ],
    },
    {
      name: 'Household',
      slug: 'household',
      subs: [
        { id: 'cleaning', name: 'Cleaning' },
        { id: 'laundry', name: 'Laundry' },
        { id: 'kitchen', name: 'Kitchen' },
        { id: 'home-essentials', name: 'Home Essentials' },
      ],
    },
    {
      name: 'Baby & Pet',
      slug: 'baby-pet',
      subs: [
        { id: 'baby-care', name: 'Baby Care' },
        { id: 'pet-food', name: 'Pet Food' },
        { id: 'pet-essentials', name: 'Pet Essentials' },
      ],
    },
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
        subcategories: def.subs.map((sub) => ({ id: sub.id, name: sub.name, isActive: true })),
      });
    } else {
      // Backfill any subcategories missing from an older seed run, without touching
      // ones that already exist (which may since have real products attached).
      const existingIds = new Set(category.subcategories.map((s) => s.id));
      const missing = def.subs.filter((sub) => !existingIds.has(sub.id));
      if (missing.length > 0) {
        category.subcategories.push(...missing.map((sub) => ({ id: sub.id, name: sub.name, isActive: true })));
        await category.save();
      }
    }
    categories[def.slug] = category;
  }

  const productDefs = [
    { name: 'Fortune Sunflower Oil', category: 'grocery', sub: 'staples', tags: ['deal', 'essential'], variants: [{ id: 'v-500ml', label: '500 ml', mrp: 175, price: 148 }, { id: 'v-1l', label: '1 L', mrp: 320, price: 279 }] },
    { name: 'Amul Gold Full Cream Milk', category: 'grocery', sub: 'dairy-breakfast', tags: ['essential'], variants: [{ id: 'v-500ml', label: '500 ml', mrp: 35, price: 32 }] },
    { name: 'Farm Fresh Eggs (12 pack)', category: 'grocery', sub: 'dairy-breakfast', tags: ['essential', 'saver'], variants: [{ id: 'v-12pc', label: '12 pieces', mrp: 96, price: 89 }] },
    { name: 'Tata Salt', category: 'grocery', sub: 'staples', tags: ['saver', 'essential'], variants: [{ id: 'v-1kg', label: '1 kg', mrp: 25, price: 22 }] },
    { name: 'Fresh Bananas', category: 'grocery', sub: 'fruits-vegetables', tags: ['deal'], variants: [{ id: 'v-1dz', label: '1 dozen', mrp: 60, price: 49 }] },
    { name: 'Fresh Tomatoes', category: 'grocery', sub: 'fruits-vegetables', tags: ['deal', 'saver'], variants: [{ id: 'v-1kg', label: '1 kg', mrp: 40, price: 30 }] },
    { name: "Lay's Classic Salted Chips", category: 'snacks', sub: 'chips-snacks', tags: ['deal'], variants: [{ id: 'v-52g', label: '52 g', mrp: 20, price: 20 }] },
    { name: 'Coca-Cola', category: 'snacks', sub: 'soft-drinks', tags: ['saver'], variants: [{ id: 'v-750ml', label: '750 ml', mrp: 45, price: 40 }] },
    { name: 'Pears Soap', category: 'personal-care', sub: 'bath-body', tags: ['essential'], variants: [{ id: 'v-125g', label: '125 g', mrp: 55, price: 49 }] },
    { name: 'Colgate Strong Teeth Toothpaste', category: 'personal-care', sub: 'oral-care', tags: ['essential'], variants: [{ id: 'v-200g', label: '200 g', mrp: 105, price: 92 }] },
    { name: 'Vim Dishwash Gel', category: 'household', sub: 'cleaning', tags: ['essential'], variants: [{ id: 'v-500ml', label: '500 ml', mrp: 130, price: 109 }] },
    { name: 'Surf Excel Detergent', category: 'household', sub: 'laundry', tags: ['saver'], variants: [{ id: 'v-1kg', label: '1 kg', mrp: 150, price: 129 }] },
    { name: 'Pampers Baby Diapers', category: 'baby-pet', sub: 'baby-care', tags: ['essential'], variants: [{ id: 'v-m34', label: 'M, 34 pcs', mrp: 599, price: 519 }] },
    { name: 'Pedigree Adult Dog Food', category: 'baby-pet', sub: 'pet-food', tags: ['essential'], variants: [{ id: 'v-3kg', label: '3 kg', mrp: 750, price: 675 }] },
  ];

  for (const def of productDefs) {
    const category = categories[def.category];
    const existing = await Product.findOne({ vendorId: vendor._id, name: def.name });
    if (existing) continue;
    const subcategory = category.subcategories.find((s) => s.id === def.sub);
    await Product.create({
      vendorId: vendor._id,
      categoryId: category._id,
      subcategoryId: subcategory?.id,
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
