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
    { name: 'iPhone 15 Pro', description: 'Latest Apple iPhone with A17 Pro chip and titanium design.', price: 134900, discountPrice: 124900, category: elec, brand: 'Apple', stock: 50, isFeatured: true, ratings: 4.8, numReviews: 120, images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Samsung Galaxy S24 Ultra', description: 'Samsung flagship with AI-powered camera and S Pen.', price: 129999, discountPrice: 119999, category: elec, brand: 'Samsung', stock: 30, isFeatured: true, ratings: 4.7, numReviews: 95, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation headphones.', price: 34990, discountPrice: 29990, category: elec, brand: 'Sony', stock: 80, isFeatured: true, ratings: 4.9, numReviews: 200, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600&auto=format&fit=crop'] },
    { name: 'MacBook Air M3', description: '13-inch laptop with M3 chip, all-day battery life.', price: 114900, discountPrice: 109900, category: elec, brand: 'Apple', stock: 25, isFeatured: true, ratings: 4.9, numReviews: 85, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Men\'s Classic White Sneakers', description: 'Stylish and comfortable white sneakers for everyday wear.', price: 2999, discountPrice: 1999, category: fashion, brand: 'Nike', stock: 200, isFeatured: false, ratings: 4.3, numReviews: 45, images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Women\'s Floral Kurta Set', description: 'Elegant floral print kurta with palazzo pants.', price: 1799, discountPrice: 1299, category: fashion, brand: 'FabIndia', stock: 150, isFeatured: true, ratings: 4.5, numReviews: 60, images: ['https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Ergonomic Office Chair', description: 'Lumbar support office chair with adjustable height and armrests.', price: 18999, discountPrice: 14999, category: home, brand: 'DuraFlex', stock: 40, isFeatured: true, ratings: 4.4, numReviews: 35, images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Yoga Mat Premium', description: 'Anti-slip premium yoga mat with carrying strap.', price: 1499, discountPrice: 999, category: sports, brand: 'Boldfit', stock: 300, isFeatured: false, ratings: 4.6, numReviews: 78, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Atomic Habits', description: 'Best-selling self-help book by James Clear.', price: 599, discountPrice: 399, category: books, brand: 'Penguin', stock: 500, isFeatured: false, ratings: 4.8, numReviews: 400, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Vitamin C Serum', description: 'Brightening vitamin C serum for glowing skin.', price: 899, discountPrice: 699, category: beauty, brand: 'Minimalist', stock: 180, isFeatured: true, ratings: 4.7, numReviews: 150, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Boat Airdopes 141', description: 'True wireless earbuds with 42-hour battery backup.', price: 1999, discountPrice: 999, category: elec, brand: 'boAt', stock: 250, isFeatured: true, ratings: 4.2, numReviews: 320, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Stainless Steel Water Bottle', description: '1L insulated water bottle keeping drinks hot/cold for 24hrs.', price: 799, discountPrice: 599, category: home, brand: 'Milton', stock: 400, isFeatured: false, ratings: 4.5, numReviews: 90, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Designer Kurta Sets', description: 'Beautiful designer kurta sets for festive occasions.', price: 999, discountPrice: 249, category: fashion, brand: 'Biba', stock: 100, isFeatured: true, ratings: 4.6, numReviews: 85, images: ['https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Prestige Mixer Grinder', description: 'Powerful 750W mixer grinder with 3 stainless steel jars.', price: 2999, discountPrice: 499, category: home, brand: 'Prestige', stock: 50, isFeatured: true, ratings: 4.3, numReviews: 210, images: ['https://images.unsplash.com/photo-1585659722983-38ca899fc73d?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Infinix NOTE EDGE', description: '3D curved 1.5K AMOLED display with 108MP camera.', price: 29999, discountPrice: 24999, category: elec, brand: 'Infinix', stock: 40, isFeatured: true, ratings: 4.8, numReviews: 120, images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Adidas Running Shoes', description: 'Lightweight and breathable running shoes for daily workouts.', price: 3999, discountPrice: 1999, category: fashion, brand: 'Adidas', stock: 150, isFeatured: true, ratings: 4.5, numReviews: 300, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Denver Deodorant Body Spray', description: 'Long-lasting masculine fragrance for all-day freshness.', price: 399, discountPrice: 299, category: beauty, brand: 'Denver', stock: 200, isFeatured: true, ratings: 4.4, numReviews: 450, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Puma Sports T-Shirt', description: 'Breathable dry-fit t-shirt for intense workouts.', price: 1499, discountPrice: 899, category: fashion, brand: 'Puma', stock: 120, isFeatured: false, ratings: 4.5, numReviews: 85, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Dell XPS 15', description: 'Premium 15-inch laptop with stunning 4K display and powerful performance.', price: 185000, discountPrice: 175000, category: elec, brand: 'Dell', stock: 20, isFeatured: true, ratings: 4.8, numReviews: 110, images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop'] },
    { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness.', price: 399, discountPrice: 299, category: books, brand: 'Harriman House', stock: 350, isFeatured: true, ratings: 4.9, numReviews: 500, images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop'] },
    { name: 'L\'Oreal Paris Shampoo', description: 'Deep nourishing shampoo for healthy and shiny hair.', price: 599, discountPrice: 449, category: beauty, brand: 'L\'Oreal', stock: 250, isFeatured: false, ratings: 4.3, numReviews: 320, images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Nivia Football', description: 'Durable football for outdoor matches and practice sessions.', price: 899, discountPrice: 699, category: sports, brand: 'Nivia', stock: 100, isFeatured: true, ratings: 4.6, numReviews: 140, images: ['https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Wooden Coffee Table', description: 'Minimalist wooden coffee table with a modern aesthetic.', price: 4500, discountPrice: 3499, category: home, brand: 'Urban Ladder', stock: 45, isFeatured: true, ratings: 4.7, numReviews: 85, images: ['https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Levis Blue Jeans', description: 'Classic slim fit denim jeans for everyday wear.', price: 2999, discountPrice: 1899, category: fashion, brand: 'Levis', stock: 180, isFeatured: true, ratings: 4.5, numReviews: 210, images: ['https://images.unsplash.com/photo-1542272604-780c8d197607?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Dumbbell Set 10kg', description: 'Adjustable dumbbell set for home strength training.', price: 1999, discountPrice: 1299, category: sports, brand: 'Kobo', stock: 60, isFeatured: false, ratings: 4.4, numReviews: 120, images: ['https://images.unsplash.com/photo-1586401700818-12d5e2e85eb6?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Sapiens: A Brief History of Humankind', description: 'A groundbreaking narrative of humanity\'s creation and evolution.', price: 499, discountPrice: 399, category: books, brand: 'Harper', stock: 200, isFeatured: true, ratings: 4.8, numReviews: 450, images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop'] },
    { name: 'Philips Trimmer', description: 'Rechargeable beard trimmer with self-sharpening blades.', price: 1499, discountPrice: 1199, category: elec, brand: 'Philips', stock: 150, isFeatured: true, ratings: 4.5, numReviews: 380, images: ['https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=600&auto=format&fit=crop'] },
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
