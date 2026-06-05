const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const connectDB = require('./config/db');

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets and electronic devices' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
  { name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor' },
  { name: 'Sports', slug: 'sports', description: 'Sports and fitness equipment' },
  { name: 'Books', slug: 'books', description: 'Books and stationery' },
  { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care' },
];

const seedDB = async () => {
  await connectDB();
  console.log('🌱 Starting seeder...');

  // Clear existing data
  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();
  console.log('✅ Cleared existing data');

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@shop.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log(`✅ Admin created: admin@shop.com / admin123`);

  // Create test user
  await User.create({
    name: 'Test User',
    email: 'user@shop.com',
    password: 'user123',
    role: 'user',
  });
  console.log(`✅ User created: user@shop.com / user123`);

  // Create categories
  const createdCategories = await Category.insertMany(categories);
  console.log(`✅ ${createdCategories.length} categories created`);

  const elec = createdCategories.find(c => c.slug === 'electronics')._id;
  const fashion = createdCategories.find(c => c.slug === 'fashion')._id;
  const home = createdCategories.find(c => c.slug === 'home-living')._id;
  const sports = createdCategories.find(c => c.slug === 'sports')._id;
  const books = createdCategories.find(c => c.slug === 'books')._id;
  const beauty = createdCategories.find(c => c.slug === 'beauty')._id;

  const products = [
    { name: 'iPhone 15 Pro', description: 'Latest Apple iPhone with A17 Pro chip and titanium design.', price: 134900, discountPrice: 124900, category: elec, brand: 'Apple', stock: 50, isFeatured: true, ratings: 4.8, numReviews: 120 },
    { name: 'Samsung Galaxy S24 Ultra', description: 'Samsung flagship with AI-powered camera and S Pen.', price: 129999, discountPrice: 119999, category: elec, brand: 'Samsung', stock: 30, isFeatured: true, ratings: 4.7, numReviews: 95 },
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation headphones.', price: 34990, discountPrice: 29990, category: elec, brand: 'Sony', stock: 80, isFeatured: true, ratings: 4.9, numReviews: 200 },
    { name: 'MacBook Air M3', description: '13-inch laptop with M3 chip, all-day battery life.', price: 114900, discountPrice: 109900, category: elec, brand: 'Apple', stock: 25, isFeatured: true, ratings: 4.9, numReviews: 85 },
    { name: 'Men\'s Classic White Sneakers', description: 'Stylish and comfortable white sneakers for everyday wear.', price: 2999, discountPrice: 1999, category: fashion, brand: 'Nike', stock: 200, isFeatured: false, ratings: 4.3, numReviews: 45 },
    { name: 'Women\'s Floral Kurta Set', description: 'Elegant floral print kurta with palazzo pants.', price: 1799, discountPrice: 1299, category: fashion, brand: 'FabIndia', stock: 150, isFeatured: true, ratings: 4.5, numReviews: 60 },
    { name: 'Ergonomic Office Chair', description: 'Lumbar support office chair with adjustable height and armrests.', price: 18999, discountPrice: 14999, category: home, brand: 'DuraFlex', stock: 40, isFeatured: true, ratings: 4.4, numReviews: 35 },
    { name: 'Yoga Mat Premium', description: 'Anti-slip premium yoga mat with carrying strap.', price: 1499, discountPrice: 999, category: sports, brand: 'Boldfit', stock: 300, isFeatured: false, ratings: 4.6, numReviews: 78 },
    { name: 'Atomic Habits', description: 'Best-selling self-help book by James Clear.', price: 599, discountPrice: 399, category: books, brand: 'Penguin', stock: 500, isFeatured: false, ratings: 4.8, numReviews: 400 },
    { name: 'Vitamin C Serum', description: 'Brightening vitamin C serum for glowing skin.', price: 899, discountPrice: 699, category: beauty, brand: 'Minimalist', stock: 180, isFeatured: true, ratings: 4.7, numReviews: 150 },
    { name: 'Boat Airdopes 141', description: 'True wireless earbuds with 42-hour battery backup.', price: 1999, discountPrice: 999, category: elec, brand: 'boAt', stock: 250, isFeatured: true, ratings: 4.2, numReviews: 320 },
    { name: 'Stainless Steel Water Bottle', description: '1L insulated water bottle keeping drinks hot/cold for 24hrs.', price: 799, discountPrice: 599, category: home, brand: 'Milton', stock: 400, isFeatured: false, ratings: 4.5, numReviews: 90 },
    { name: 'Designer Kurta Sets', description: 'Beautiful designer kurta sets for festive occasions.', price: 999, discountPrice: 249, category: fashion, brand: 'Biba', stock: 100, isFeatured: true, ratings: 4.6, numReviews: 85 },
    { name: 'Prestige Mixer Grinder', description: 'Powerful 750W mixer grinder with 3 stainless steel jars.', price: 2999, discountPrice: 499, category: home, brand: 'Prestige', stock: 50, isFeatured: true, ratings: 4.3, numReviews: 210 },
    { name: 'Infinix NOTE EDGE', description: '3D curved 1.5K AMOLED display with 108MP camera.', price: 29999, discountPrice: 24999, category: elec, brand: 'Infinix', stock: 40, isFeatured: true, ratings: 4.8, numReviews: 120 },
    { name: 'Adidas Running Shoes', description: 'Lightweight and breathable running shoes for daily workouts.', price: 3999, discountPrice: 1999, category: fashion, brand: 'Adidas', stock: 150, isFeatured: true, ratings: 4.5, numReviews: 300 },
    { name: 'Denver Deodorant Body Spray', description: 'Long-lasting masculine fragrance for all-day freshness.', price: 399, discountPrice: 299, category: beauty, brand: 'Denver', stock: 200, isFeatured: true, ratings: 4.4, numReviews: 450 },
  ];

  await Product.insertMany(products);
  console.log(`✅ ${products.length} products created`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('Admin: admin@shop.com | Password: admin123');
  console.log('User:  user@shop.com  | Password: user123');
  process.exit(0);
};

seedDB().catch(err => {
  console.error('❌ Seeder error:', err);
  process.exit(1);
});
