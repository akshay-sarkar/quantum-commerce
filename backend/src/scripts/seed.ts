import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/Product';
import UserModel from '../models/User';
import { hashPassword } from '../utils/auth';

dotenv.config();

async function seedDatabase() {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI not found in .env');
        }

        await mongoose.connect(mongoURI, {
            dbName: process.env.DB_NAME || 'quantumcommerce'
        });

        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await ProductModel.deleteMany({});
        await UserModel.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // --------- REPLACE WITH YOUR USER and ADMIN PASSWORD in .env file-------
        // Create Admin user
        const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
        const adminUser = await UserModel.create({
            email: 'admin@quantumcommerce.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            userType: 'ADMIN'
        });
        console.log(`✅ Created admin user: ${adminUser.email}`);

        // create Test User
        const testPassword = await hashPassword(process.env.USER_PASSWORD || 'test123');
        const testUser = await UserModel.create({
            email: 'akshay.sarkar@quantumcommerce.com',
            password: testPassword,
            firstName: 'Akshay',
            lastName: 'Sarkar',
            userType: 'BUYER'
        });
        console.log(`✅ Created admin user: ${testUser.email}`);

        // Create sample products with admin as addedBy
        const sampleProducts = [
            {
                name: 'MacBook Pro 16"',
                description: 'Powerful laptop with M3 chip, 16GB RAM, 512GB SSD',
                price: 2499.99,
                inventory: 15,
                category: 'Electronics',
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
                addedBy: adminUser._id,
            },
            {
                name: 'Sony WH-1000XM5 Headphones',
                description: 'Industry-leading noise cancellation, 30-hour battery',
                price: 399.99,
                inventory: 50,
                category: 'Electronics',
                imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
                addedBy: adminUser._id
            },
            {
                name: 'Ergonomic Office Chair',
                description: 'Lumbar support, adjustable armrests, breathable mesh',
                price: 299.99,
                inventory: 25,
                category: 'Furniture',
                imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
                addedBy: adminUser._id
            },
            {
                name: 'Mechanical Keyboard',
                description: 'Cherry MX Blue switches, RGB backlight, USB-C',
                price: 129.99,
                inventory: 40,
                category: 'Electronics',
                imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
                addedBy: adminUser._id
            },
            {
                name: 'Standing Desk',
                description: 'Electric height adjustment, 60" x 30" surface',
                price: 599.99,
                inventory: 12,
                category: 'Furniture',
                imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c',
                addedBy: adminUser._id
            },
            {
                name: 'iPhone 15 Pro',
                description: 'Titanium design, A17 Pro chip, 256GB storage',
                price: 1199.99,
                inventory: 30,
                category: 'Electronics',
                imageUrl: 'https://images.unsplash.com/photo-1592286927505-2fac0f09e3f4',
                addedBy: adminUser._id
            },
            {
                name: 'Leather Executive Chair',
                description: 'Genuine leather, high back, 360° swivel',
                price: 449.99,
                inventory: 18,
                category: 'Furniture',
                imageUrl: 'https://images.unsplash.com/photo-1505843795480-5cfb3c03f6ff',
                addedBy: adminUser._id
            },
            {
                name: 'Wireless Mouse',
                description: 'Ergonomic design, 6-month battery, precision tracking',
                price: 49.99,
                inventory: 100,
                category: 'Electronics',
                imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
                addedBy: adminUser._id
            },
            {
                name: '4K Monitor 27"',
                description: 'IPS panel, HDR support, USB-C connectivity',
                price: 399.99,
                inventory: 22,
                category: 'Electronics',
                imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
                addedBy: adminUser._id
            },
            {
                name: 'Desk Lamp LED',
                description: 'Adjustable brightness, USB charging port, modern design',
                price: 79.99,
                inventory: 45,
                category: 'Furniture',
                imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
                addedBy: adminUser._id
            }
        ];

        const products = await ProductModel.insertMany(sampleProducts);
        console.log(`✅ Added ${products.length} products`);

        console.log('\n📦 Sample Products:');
        products.forEach(p => {
            console.log(`  - ${p.name} ($${p.price}) - Stock: ${p.inventory} - Category: ${p.category}`);
        });

        console.log('\n🔐 Admin Credentials:');
        console.log('  Email: admin@quantumcommerce.com');
        console.log('  Password: ' + adminPassword);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seedDatabase();