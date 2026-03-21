import { config } from 'dotenv';
config();

import mongoose from 'mongoose';
import ProductModel from '../models/Product';
import UserModel from '../models/User';
import { hashPassword } from '../utils/auth';

// Image URL pools — rotated by category
const E = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
  'https://images.unsplash.com/photo-1592286927505-2fac0f09e3f4',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
];
const F = [
  'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
  'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c',
  'https://images.unsplash.com/photo-1505843795480-5cfb3c03f6ff',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
];
const A = [...E, ...F];

async function seedDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error('MONGODB_URI not found in .env');

    await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME || 'quantumcommerce',
    });
    console.log('✅ Connected to MongoDB');

    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
    const adminUser = await UserModel.create({
      email: 'admin@quantumcommerce.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      userType: 'ADMIN',
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);

    const testPassword = await hashPassword(process.env.USER_PASSWORD || 'test123');
    const testUser = await UserModel.create({
      email: 'akshay.sarkar@quantumcommerce.com',
      password: testPassword,
      firstName: 'Akshay',
      lastName: 'Sarkar',
      userType: 'BUYER',
    });
    console.log(`✅ Created test user: ${testUser.email}`);

    const by = adminUser._id;

    const sampleProducts = [
      // ─── ELECTRONICS (1–70) ───────────────────────────────────────────
      { id: '1',  name: 'MacBook Pro 16"',               description: 'M3 chip, 16GB RAM, 512GB SSD, 22-hour battery life',                        price: 2499.99, inventory: 15, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '2',  name: 'Sony WH-1000XM5 Headphones',   description: 'Industry-leading noise cancellation, 30-hour battery, multipoint connect',   price: 399.99,  inventory: 50, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '4',  name: 'Mechanical Keyboard',           description: 'Cherry MX Blue switches, RGB backlight, USB-C, compact TKL layout',          price: 129.99,  inventory: 40, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '6',  name: 'iPhone 15 Pro',                 description: 'Titanium design, A17 Pro chip, 256GB storage, 48MP triple camera',           price: 1199.99, inventory: 30, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '8',  name: 'Wireless Mouse',                description: 'Ergonomic design, 6-month battery, precision optical tracking, silent click', price: 49.99,   inventory: 100, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '9',  name: '4K Monitor 27"',                description: 'IPS panel, HDR400, USB-C 90W PD, 144Hz refresh rate',                        price: 399.99,  inventory: 22, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '11', name: 'Dell XPS 15',                   description: '15.6" OLED touch, Intel Core i9-13900H, 32GB RAM, 1TB NVMe SSD',             price: 2199.99, inventory: 18, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '12', name: 'HP Spectre x360 14',            description: '2-in-1 OLED touch, Intel Core i7, 16GB RAM, 512GB SSD, pen included',        price: 1499.99, inventory: 20, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '13', name: 'ASUS ZenBook 14 Pro',           description: 'OLED 120Hz, AMD Ryzen 9, 16GB RAM, 1TB SSD, 1.4kg ultralight',               price: 1099.99, inventory: 30, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '14', name: 'Lenovo ThinkPad X1 Carbon',     description: '14" IPS, Intel Core i7-1365U, 16GB, 512GB, MIL-SPEC durability',             price: 1399.99, inventory: 22, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '15', name: 'Razer Blade 15 Gaming Laptop',  description: '15.6" 165Hz QHD, RTX 4070, Intel i7-13800H, 16GB DDR5',                     price: 2699.99, inventory: 10, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '16', name: 'Microsoft Surface Laptop 5',    description: '13.5" PixelSense touch, Intel Core i5, 8GB, 256GB SSD, Cobalt Blue',         price: 999.99,  inventory: 25, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '17', name: 'Acer Swift 5 Ultrabook',        description: '14" IPS, Intel Core i7-1260P, 16GB, 512GB NVMe, 980g ultralight',            price: 899.99,  inventory: 35, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '18', name: 'Samsung Galaxy Book 3 Pro',     description: '15.6" Dynamic AMOLED 2X, Intel Core i7, 16GB, 512GB, SuperCharge 65W',      price: 1299.99, inventory: 15, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '19', name: 'LG Gram 17',                    description: '17" IPS anti-glare, Intel i7-1360P, 16GB, 2TB SSD, 1340g, 19.5hr battery',  price: 1599.99, inventory: 12, category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '20', name: 'MSI Stealth 16 Studio',         description: '16" QHD 240Hz, Intel Core i9-13950HX, RTX 4080, 32GB DDR5',                 price: 2999.99, inventory: 8,  category: 'Electronics', imageUrl: E[0], addedBy: by },
      { id: '21', name: 'Samsung Galaxy S24 Ultra',      description: '6.8" Dynamic AMOLED 2X, 200MP camera, 256GB, Snapdragon 8 Gen 3, S Pen',    price: 1299.99, inventory: 35, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '22', name: 'Google Pixel 8 Pro',            description: '6.7" LTPO OLED, 50MP triple camera, 128GB, Google Tensor G3, 7 years OS',   price: 999.99,  inventory: 28, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '23', name: 'OnePlus 12',                    description: '6.82" 120Hz LTPO4 AMOLED, Snapdragon 8 Gen 3, 256GB, 100W SuperVOOC',       price: 799.99,  inventory: 40, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '24', name: 'Nothing Phone 2',               description: '6.7" OLED 120Hz, Glyph Interface, 256GB, Snapdragon 8+ Gen 1',              price: 699.99,  inventory: 45, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '25', name: 'Motorola Edge 40 Pro',          description: '6.67" 165Hz pOLED, 50MP triple cam, 256GB, 125W TurboPower charging',       price: 599.99,  inventory: 50, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '26', name: 'Sony Xperia 1 V',               description: '6.5" 4K 120Hz OLED, 52MP triple Zeiss camera, 256GB, IP68',                 price: 1099.99, inventory: 20, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '27', name: 'Samsung Galaxy A54 5G',         description: '6.4" Super AMOLED 120Hz, 50MP OIS camera, 256GB, 5000mAh, IP67',            price: 449.99,  inventory: 60, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '28', name: 'Apple AirPods Pro 2nd Gen',     description: 'H2 chip, adaptive ANC, spatial audio, MagSafe case, USB-C, 30hr total',     price: 249.99,  inventory: 80, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '29', name: 'Bose QuietComfort 45',          description: 'World-class noise cancellation, 24-hour battery, Aware mode, foldable',      price: 329.99,  inventory: 45, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '30', name: 'Sennheiser Momentum 4',         description: 'Hi-Fi audiophile sound, 60-hour battery, adaptive ANC, USB-C',              price: 349.99,  inventory: 30, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '31', name: 'JBL Flip 6',                    description: 'Portable Bluetooth 5.1 speaker, IP67 waterproof, 12-hour playtime, PartyBoost', price: 129.99, inventory: 75, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '32', name: 'Sony WF-1000XM4 Earbuds',       description: 'True wireless, industry-best ANC, LDAC Hi-Res, 36hr total with case',       price: 199.99,  inventory: 55, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '33', name: 'Marshall Stanmore III',          description: 'Iconic design, Bluetooth 5.2, dual 30W tweeter, 50W woofer, rich bass',     price: 349.99,  inventory: 25, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '34', name: 'Beats Studio Pro Headphones',   description: 'Real-time ANC, 40-hour battery, USB-C lossless audio, multipoint pairing',  price: 349.99,  inventory: 40, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '35', name: 'Apple Watch Series 9 45mm',     description: 'Always-on Retina, S9 chip, crash detection, blood oxygen, double tap',      price: 429.99,  inventory: 50, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '36', name: 'Samsung Galaxy Watch 6 Classic', description: '47mm Super AMOLED, rotating bezel, body composition, Wear OS 4',           price: 399.99,  inventory: 40, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '37', name: 'Garmin Fenix 7 Pro Solar',      description: 'Multisport GPS, solar charging, 25-day battery, topographic maps, diving',  price: 699.99,  inventory: 20, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '38', name: 'Fitbit Sense 2',                description: 'Advanced health smartwatch, EDA sensor, ECG app, stress score, 6-day',      price: 249.99,  inventory: 60, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '39', name: 'Sony Alpha A7 IV',               description: 'Full-frame mirrorless, 33MP BSI sensor, 4K 60fps, 5-axis IBIS, weather sealed', price: 2499.99, inventory: 10, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '40', name: 'Canon EOS R6 Mark II',          description: '24.2MP full-frame, 4K 60fps RAW, 40fps burst, IBIS, dual UHS-II card',     price: 2499.99, inventory: 8,  category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '41', name: 'DJI Mini 4 Pro Drone',          description: '4K/60fps, omnidirectional obstacle sensing, 34-min flight, 20km range',     price: 759.99,  inventory: 15, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '42', name: 'GoPro Hero 12 Black',           description: '5.3K60 video, HyperSmooth 6.0, waterproof 10m, Max Lens Mod 2.0',          price: 399.99,  inventory: 30, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '43', name: 'DJI Osmo Pocket 3',             description: '4K/120fps, 1-inch CMOS sensor, 3-axis gimbal, ActiveTrack 6.0',            price: 519.99,  inventory: 22, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '44', name: 'PS5 DualSense Controller',      description: 'Haptic feedback, adaptive triggers, built-in mic, USB-C, 3D audio',        price: 69.99,   inventory: 100, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '45', name: 'Xbox Wireless Controller',      description: 'Carbon Black, Bluetooth 5.0, USB-C, 40hr battery, Share button',           price: 59.99,   inventory: 120, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '46', name: 'Logitech G Pro X Superlight 2', description: '32K DPI HERO 2 sensor, 95g ultra-light, 95hr battery, LIGHTSPEED',         price: 159.99,  inventory: 45, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '47', name: 'SteelSeries Arctis Nova Pro',   description: 'Hi-Fi gaming headset, ANC, ClearCast Gen 2 mic, multi-system connect',     price: 349.99,  inventory: 25, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '48', name: 'Corsair K100 RGB Keyboard',     description: 'OPX optical-mechanical switches, per-key RGB, iCUE, Elgato integration',   price: 229.99,  inventory: 30, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '49', name: 'ASUS ROG Ally Handheld',        description: 'AMD Ryzen Z1 Extreme, 7" 120Hz FHD, 512GB, Windows 11 portable gaming',    price: 699.99,  inventory: 18, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '50', name: 'Elgato Stream Deck MK.2',       description: '15 customizable LCD keys, streaming/content creation controller, plugins',  price: 149.99,  inventory: 40, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '51', name: 'Amazon Echo Show 10',           description: '10.1" HD display, Alexa, motion tracking, Zigbee hub, 13MP camera',        price: 249.99,  inventory: 35, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '52', name: 'Google Nest Hub Max',           description: '10" smart display, built-in Nest Cam, Face Match, ambient EQ display',     price: 229.99,  inventory: 30, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '53', name: 'Apple HomePod Mini',            description: 'Computational audio, Siri, Thread, spatial audio, Ultra Wideband chip',     price: 99.99,   inventory: 60, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '54', name: 'Ring Video Doorbell Pro 2',     description: '1536p head-to-toe HD video, 3D motion detection, dual-band Wi-Fi, radar', price: 249.99,  inventory: 40, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '55', name: 'Philips Hue Starter Kit',       description: '4 A19 smart bulbs + Bridge, 16M colors, works with Alexa/Google/HomeKit',  price: 199.99,  inventory: 50, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '56', name: 'Nest Learning Thermostat',      description: 'Auto-schedule, Farsight display, energy history, HVAC monitoring, Wi-Fi',  price: 249.99,  inventory: 35, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '57', name: 'Arlo Pro 4 Security Camera',    description: '2K HDR wireless, color night vision, built-in siren, IP65, no hub needed', price: 199.99,  inventory: 40, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '58', name: 'Anker PowerBank 24000mAh',      description: '65W fast charge, 3 ports (USB-C + 2A), digital display, airline-safe',     price: 79.99,   inventory: 100, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '59', name: 'iPad Pro 12.9" M2',             description: '12.9" Liquid Retina XDR, M2 chip, 256GB, Thunderbolt, Apple Pencil 2',    price: 1099.99, inventory: 20, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '60', name: 'Samsung Galaxy Tab S9 Ultra',   description: '14.6" Dynamic AMOLED 2X, Snapdragon 8 Gen 2, 256GB, S Pen, IP68',         price: 1099.99, inventory: 18, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '61', name: 'Microsoft Surface Pro 9',       description: '13" PixelSense 120Hz, Intel Core i7, 16GB, 256GB, Signature keyboard',     price: 1299.99, inventory: 15, category: 'Electronics', imageUrl: E[3], addedBy: by },
      { id: '62', name: 'Logitech MX Master 3S Mouse',   description: '8K DPI, MagSpeed scroll, multi-device Bluetooth, USB-C, quiet clicks',    price: 99.99,   inventory: 75, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '63', name: 'LG UltraWide 34" Curved',       description: '34" 21:9 QHD, 160Hz, VESA DisplayHDR 400, AMD FreeSync, USB-C 96W',      price: 699.99,  inventory: 15, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '64', name: 'Dell 32" 4K USB-C Monitor',     description: '31.5" IPS 4K, 60Hz, HDR400, 90W USB-C, 3-year Advanced Exchange',         price: 599.99,  inventory: 18, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '65', name: 'BenQ PD3220U Designer Monitor', description: '32" 4K IPS, Thunderbolt 3, USB hub, Display Pilot, factory calibrated',   price: 799.99,  inventory: 10, category: 'Electronics', imageUrl: E[5], addedBy: by },
      { id: '66', name: 'Rode NT-USB Mini Mic',          description: 'Studio-quality USB condenser, zero-latency monitoring, plug-and-play',     price: 99.99,   inventory: 50, category: 'Electronics', imageUrl: E[1], addedBy: by },
      { id: '67', name: 'Elgato 4K Capture Card',        description: '4K60 HDR passthrough, 1080p60 capture, low-latency, OBS ready',           price: 199.99,  inventory: 30, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '68', name: 'Anker USB-C Hub 10-in-1',       description: '4K HDMI, 100W PD, 3x USB-A, SD/microSD, Gigabit Ethernet, USB-C data',   price: 59.99,   inventory: 90, category: 'Electronics', imageUrl: E[4], addedBy: by },
      { id: '69', name: 'Keychron Q1 Pro Keyboard',      description: 'Gasket-mount TKL, QMK/VIA, hot-swap POM plate, triple-mode wireless',     price: 189.99,  inventory: 35, category: 'Electronics', imageUrl: E[2], addedBy: by },
      { id: '70', name: 'Razer Viper V2 Pro Mouse',      description: '30K DPI Focus Pro, 58g ultra-light, 80hr battery, HyperSpeed 4K polling', price: 149.99,  inventory: 40, category: 'Electronics', imageUrl: E[4], addedBy: by },

      // ─── FURNITURE (3, 5, 7, 10 original + 71–130) ───────────────────
      { id: '3',  name: 'Ergonomic Office Chair',         description: 'Lumbar support, adjustable armrests, breathable mesh back, 250lb capacity', price: 299.99,  inventory: 25, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '5',  name: 'Electric Standing Desk',         description: 'Electric height adjustment 28"–48", 60" x 30" bamboo top, memory presets',  price: 599.99,  inventory: 12, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '7',  name: 'Leather Executive Chair',        description: 'Genuine leather, high back, 360° swivel, pneumatic height, padded armrests', price: 449.99,  inventory: 18, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '10', name: 'LED Desk Lamp',                  description: 'Adjustable brightness & color temp, USB-A charging, flexible arm, memory',  price: 79.99,   inventory: 45, category: 'Furniture', imageUrl: F[3], addedBy: by },
      { id: '71', name: 'L-Shaped Executive Desk',        description: 'Corner design, 63" x 55" workspace, cable management grommet, MDF top',     price: 449.99,  inventory: 10, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '72', name: 'Compact Writing Desk',           description: '40" x 20", 2 drawers, solid pine legs, distressed finish, space-saving',     price: 149.99,  inventory: 35, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '73', name: 'Gaming Desk with LED Strip',     description: 'RGB LED, built-in monitor stand, cup holder, headset hook, 55" surface',     price: 229.99,  inventory: 25, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '74', name: 'Adjustable Height Desk Converter', description: 'Sit-stand riser, fits desktops up to 36", dual monitor support, keyboard tray', price: 249.99, inventory: 20, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '75', name: 'Glass Top Computer Desk',        description: 'Tempered glass, chrome steel frame, 47" wide, keyboard tray, monitor shelf', price: 179.99,  inventory: 20, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '76', name: '5-Shelf Bookcase',               description: 'Espresso finish, adjustable shelves, 72" tall, 150lb total capacity',        price: 129.99,  inventory: 30, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '77', name: 'Floating Wall Shelves Set of 3', description: 'Oak veneer, hidden brackets, holds 20lb each, easy install, 3 lengths',      price: 59.99,   inventory: 60, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '78', name: 'Farmhouse Coffee Table',         description: 'Rustic solid wood top, lower storage shelf, tapered legs, 48" x 24"',        price: 199.99,  inventory: 20, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '79', name: 'Lift-Top Coffee Table',          description: 'Hidden storage compartment, adjustable tabletop, modern walnut finish',       price: 249.99,  inventory: 15, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '80', name: 'Round Dining Table 60"',         description: 'Solid oak, pedestal base, seats 6 comfortably, unfinished for custom stain',  price: 599.99,  inventory: 8,  category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '81', name: 'Extendable Dining Table',        description: 'Butterfly leaf extends 60" to 90", tempered glass top, chrome legs, seats 8', price: 699.99,  inventory: 6,  category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '82', name: 'Industrial Side Table',          description: 'Solid mango wood top, matte black iron frame, 3-tier, 24" height',           price: 79.99,   inventory: 50, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '83', name: 'Mesh Task Chair',                description: 'Breathable mesh back, lumbar support, flip-up armrests, seat depth adjust',   price: 189.99,  inventory: 40, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '84', name: 'Kneeling Ergonomic Chair',       description: 'Active sitting posture, knee pads, solid birch frame, height adjustable',     price: 129.99,  inventory: 30, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '85', name: 'Drafting Chair with Footrest',   description: 'Adjustable footring, extra-tall cylinder, PU leather seat, lumbar pad',       price: 159.99,  inventory: 25, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '86', name: 'Bean Bag Chair XL',              description: 'Memory foam fill, double-stitched cover, machine washable, 4ft diameter',     price: 89.99,   inventory: 45, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '87', name: 'Recliner Swivel Chair',          description: 'Plush fabric, 360° swivel, manual recline, USB charging in armrest',          price: 399.99,  inventory: 12, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '88', name: 'Chaise Lounge Sofa',             description: 'Velvet upholstery, solid oak legs, reversible chaise, 64" long, FSC wood',   price: 349.99,  inventory: 10, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '89', name: '3-Seater Mid-Century Sofa',      description: 'Linen blend fabric, splayed solid oak legs, button tufting, multiple colors', price: 799.99,  inventory: 6,  category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '90', name: 'L-Shape Sectional Sofa',         description: 'Reversible chaise, washable slipcovers, 110" total width, modular design',    price: 1199.99, inventory: 4,  category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '91', name: 'Boucle Accent Chair',            description: 'Textured boucle fabric, gold metal legs, 30" wide, lumbar pillow included',  price: 349.99,  inventory: 15, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '92', name: 'Arc Floor Lamp',                 description: 'Adjustable brushed steel arc, linen drum shade, weighted marble base',        price: 149.99,  inventory: 30, category: 'Furniture', imageUrl: F[3], addedBy: by },
      { id: '93', name: 'Ceramic Table Lamp',             description: 'Hand-thrown ceramic base, linen shade, E26 bulb included, 24" height',        price: 89.99,   inventory: 40, category: 'Furniture', imageUrl: F[3], addedBy: by },
      { id: '94', name: 'Dimmable LED Floor Lamp',        description: 'Touch control 3 brightness, 3 color temps, USB-A port, modern black finish',  price: 119.99,  inventory: 35, category: 'Furniture', imageUrl: F[3], addedBy: by },
      { id: '95', name: 'Bedside Lamp Set of 2',          description: 'Touch dimmer 3-level, USB-C charging, linen shade, plug-in cord',             price: 79.99,   inventory: 50, category: 'Furniture', imageUrl: F[3], addedBy: by },
      { id: '96', name: 'Natural Himalayan Salt Lamp',    description: 'Authentic pink crystal, warm amber glow, dimmer switch, 7–10 lb crystal',     price: 34.99,   inventory: 80, category: 'Furniture', imageUrl: F[3], addedBy: by },
      { id: '97', name: 'Smart Ceiling Light RGBW',       description: 'Wi-Fi, 16M colors + warm white, voice control, flush mount, 60W equiv',      price: 129.99,  inventory: 30, category: 'Furniture', imageUrl: F[3], addedBy: by },
      { id: '98', name: 'King Bed Frame with Headboard',  description: 'Upholstered padded headboard, solid pine slats, no box spring, noise-free',  price: 599.99,  inventory: 8,  category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '99', name: 'Queen Platform Bed Frame',       description: 'Low-profile, channel-tufted headboard, center support legs, no box spring',  price: 449.99,  inventory: 10, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '100', name: 'Twin-over-Full Bunk Bed',       description: 'Solid pine, safety rail, ladder, full bottom for teen/guest rooms',           price: 499.99,  inventory: 8,  category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '101', name: 'Nightstand with Wireless Charging', description: '2 drawers, Qi wireless pad, USB-C port, oak veneer, soft-close glides',  price: 149.99,  inventory: 25, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '102', name: '6-Drawer Solid Wood Dresser',   description: 'Dovetail joints, soft-close, anti-tip hardware, multiple wood finishes',      price: 499.99,  inventory: 10, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '103', name: 'Wardrobe Armoire 70"',          description: '2 mirrored doors, 4 shelves, hanging rail, 70" tall, assembly included',      price: 399.99,  inventory: 8,  category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '104', name: 'Bamboo Shoe Rack Cabinet',      description: '3 tiers, 12 pair capacity, natural bamboo, open design, ventilated',          price: 69.99,   inventory: 50, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '105', name: 'Entryway Coat Rack with Shelf', description: '6 double hooks, upper shelf, bottom tray for shoes, solid bamboo',            price: 89.99,   inventory: 40, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '106', name: 'TV Stand for 65" TVs',          description: 'Walnut veneer, 3-shelf open storage, cable management, 130" width',           price: 249.99,  inventory: 18, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '107', name: 'Wall-Mounted Floating TV Unit', description: '60" white gloss, 2 drawers, concealed cable channel, requires wall mount',   price: 299.99,  inventory: 12, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '108', name: 'Cube Storage Organizer 12-Cube', description: 'Mix open/closed compartments, fabric bins included, 48" x 48"',             price: 179.99,  inventory: 20, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '109', name: 'Tufted Storage Ottoman',        description: 'Button-tufted velvet lid, hinged top, 45L interior, hairpin legs',             price: 99.99,   inventory: 35, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '110', name: 'Filing Cabinet 3-Drawer',       description: 'Letter-size, keyed lock, full-extension slides, mobile casters, steel',       price: 179.99,  inventory: 20, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '111', name: 'Heavy-Duty 5-Tier Metal Shelving', description: '5 tiers, 1600lb capacity total, adjustable, boltless assembly, silver',   price: 149.99,  inventory: 15, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '112', name: 'Teak Garden Bench 3-Seater',    description: 'Grade A teak, weather resistant, natural oil finish, 59" long, 550lb cap',   price: 349.99,  inventory: 10, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '113', name: 'Outdoor Dining Set 6-Piece',    description: 'UV-resistant resin table + 4 chairs + bench, all-weather, stackable',         price: 799.99,  inventory: 5,  category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '114', name: 'Hammock with Steel Stand',      description: 'Handwoven cotton rope, 15-foot stand, 450lb capacity, with carry bag',        price: 149.99,  inventory: 20, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '115', name: 'Bar Stool Set of 2 Adjustable', description: 'Counter to bar height, footrest, 360° swivel, PU leather, easy clean',       price: 149.99,  inventory: 28, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '116', name: 'Murphy Wall Bed Queen',         description: 'Vertical fold, piston gas spring, integrated shelving, no tools for use',     price: 1199.99, inventory: 4,  category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '117', name: 'Futon Sofa Bed',                description: 'Bifold click-clack, faux leather, 3 reclining positions, solid wood legs',   price: 299.99,  inventory: 15, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '118', name: 'Floor Cushion Pouf Boho',       description: 'Handwoven cotton, 20" x 13", removable cover, eco fill, multiple patterns',  price: 49.99,   inventory: 60, category: 'Furniture', imageUrl: F[0], addedBy: by },
      { id: '119', name: 'Pegboard Wall Organizer Kit',   description: '24" x 48" MDF pegboard, 30 accessories, painted, garage or craft room',      price: 79.99,   inventory: 30, category: 'Furniture', imageUrl: F[1], addedBy: by },
      { id: '120', name: 'Nesting Tables Set of 3',       description: 'Walnut veneer, solid steel hairpin legs, stackable, space-saving design',     price: 149.99,  inventory: 25, category: 'Furniture', imageUrl: F[1], addedBy: by },

      // ─── CLOTHING (131–190) ───────────────────────────────────────────
      { id: '131', name: "Men's Slim Fit Jeans",          description: 'Classic indigo denim, 98% cotton 2% elastane, slim tapered leg, 28–36W',     price: 69.99,   inventory: 80, category: 'Clothing', imageUrl: A[0],  addedBy: by },
      { id: '132', name: "Women's High-Waist Leggings",   description: '4-way stretch, moisture-wicking, squat-proof, 7/8 length, XS–XL',            price: 39.99,   inventory: 120, category: 'Clothing', imageUrl: A[1], addedBy: by },
      { id: '133', name: "Men's Oxford Button-Down Shirt", description: '100% cotton, button-down collar, slim fit, wrinkle-resistant, S–XXL',        price: 49.99,   inventory: 90, category: 'Clothing', imageUrl: A[2],  addedBy: by },
      { id: '134', name: "Women's Floral Wrap Dress",     description: 'Chiffon fabric, V-neck, midi length, adjustable waist tie, S–XL',            price: 59.99,   inventory: 75, category: 'Clothing', imageUrl: A[3],  addedBy: by },
      { id: '135', name: "Men's Bomber Jacket",           description: 'Nylon shell, sherpa lining, zip pockets, ribbed cuffs and hem, S–XXL',       price: 89.99,   inventory: 50, category: 'Clothing', imageUrl: A[4],  addedBy: by },
      { id: '136', name: "Women's Tailored Blazer",       description: 'Single-button, stretch fabric, notch lapel, lined, multiple neutrals',        price: 79.99,   inventory: 60, category: 'Clothing', imageUrl: A[5],  addedBy: by },
      { id: '137', name: 'Unisex Fleece Hoodie',          description: '400gsm French terry, kangaroo pocket, relaxed fit, sustainable cotton',       price: 59.99,   inventory: 100, category: 'Clothing', imageUrl: A[6], addedBy: by },
      { id: '138', name: "Men's Stretch Chino Pants",     description: 'Slim tapered, stretch twill, slash pockets, 28–38 waist, 10 colors',          price: 59.99,   inventory: 85, category: 'Clothing', imageUrl: A[7],  addedBy: by },
      { id: '139', name: "Women's Packable Puffer Jacket", description: 'Lightweight down, stuff-sack included, baffled design, water-resistant',     price: 99.99,   inventory: 55, category: 'Clothing', imageUrl: A[8],  addedBy: by },
      { id: '140', name: "Men's Merino Wool Sweater",     description: '100% merino, ribbed cuffs & hem, crew neck, odor-resistant, M–XXL',           price: 79.99,   inventory: 60, category: 'Clothing', imageUrl: A[9],  addedBy: by },
      { id: '141', name: "Women's Cropped Logo Tee",      description: 'Organic cotton, boxy fit, dropped shoulder, screen print logo, XS–XL',        price: 29.99,   inventory: 140, category: 'Clothing', imageUrl: A[0], addedBy: by },
      { id: '142', name: "Men's Piqué Polo Shirt",        description: 'Cotton piqué, embroidered chest logo, classic fit, moisture-wicking, S–XXL',  price: 44.99,   inventory: 100, category: 'Clothing', imageUrl: A[1], addedBy: by },
      { id: '143', name: "Women's Mid-Wash Denim Jacket", description: 'Classic fit, chest pockets, button closure, 100% cotton, S–XL',               price: 69.99,   inventory: 70, category: 'Clothing', imageUrl: A[2],  addedBy: by },
      { id: '144', name: "Men's Quick-Dry Swim Shorts",   description: '7" inseam, mesh lining, elastic waist with drawstring, side pocket, UPF 30',  price: 34.99,   inventory: 90, category: 'Clothing', imageUrl: A[3],  addedBy: by },
      { id: '145', name: "Women's Open-Front Cardigan",   description: 'Soft ribbed knit, oversized fit, 2 pockets, multiple muted tones, XS–XL',     price: 54.99,   inventory: 80, category: 'Clothing', imageUrl: A[4],  addedBy: by },
      { id: '146', name: "Men's Reflective Running Shorts", description: 'Lightweight, inner liner, reflective strips, zip side pocket, S–XXL',       price: 39.99,   inventory: 100, category: 'Clothing', imageUrl: A[5], addedBy: by },
      { id: '147', name: "Women's High-Support Sports Bra", description: 'Moisture-wicking, wide underbust band, removable padding, XS–XL',           price: 44.99,   inventory: 120, category: 'Clothing', imageUrl: A[6], addedBy: by },
      { id: '148', name: "Men's Water-Resistant Puffer Vest", description: 'Lightweight fill, elastic hem, two zip pockets, packable, S–XXL',         price: 64.99,   inventory: 60, category: 'Clothing', imageUrl: A[7],  addedBy: by },
      { id: '149', name: "Women's Boho Maxi Skirt",       description: 'Flowy chiffon, elastic waist, tiered hem, printed pattern, S–XL',             price: 49.99,   inventory: 75, category: 'Clothing', imageUrl: A[8],  addedBy: by },
      { id: '150', name: "Men's Heavyweight Graphic Tee", description: '220gsm cotton, front print, reinforced collar, preshrunk, XS–3XL',             price: 24.99,   inventory: 150, category: 'Clothing', imageUrl: A[9], addedBy: by },
      { id: '151', name: "Women's 7/8 Yoga Pants",        description: 'High-rise, squat-proof, hidden pocket, 4-way stretch nylon, XS–XL',           price: 54.99,   inventory: 110, category: 'Clothing', imageUrl: A[0], addedBy: by },
      { id: '152', name: "Men's Wool Blend Overcoat",     description: 'Double-breasted, belted, knee-length, 70% wool, fully lined, S–XXL',          price: 149.99,  inventory: 35, category: 'Clothing', imageUrl: A[1],  addedBy: by },
      { id: '153', name: "Women's Classic Trench Coat",   description: 'Belted, epaulettes, storm flap, water-resistant cotton blend, S–XL',           price: 129.99,  inventory: 40, category: 'Clothing', imageUrl: A[2],  addedBy: by },
      { id: '154', name: "Men's Skinny Fit Dark Wash Jeans", description: 'Stretch denim, dark indigo, skinny cut, 5-pocket, 28–34W',                 price: 74.99,   inventory: 70, category: 'Clothing', imageUrl: A[3],  addedBy: by },
      { id: '155', name: "Women's Wide-Leg Cargo Pants",  description: '6 pockets, twill cotton, elastic back waist, relaxed through thigh, XS–XL',   price: 64.99,   inventory: 65, category: 'Clothing', imageUrl: A[4],  addedBy: by },
      { id: '156', name: "Men's Quarter-Zip Fleece",      description: 'Anti-pill fleece, mock neck, raglan sleeves, two side pockets, S–XXL',         price: 64.99,   inventory: 75, category: 'Clothing', imageUrl: A[5],  addedBy: by },
      { id: '157', name: "Women's Ribbed Turtleneck",     description: 'Fitted knit, classic neutral palette, easy care viscose blend, XS–XL',         price: 44.99,   inventory: 85, category: 'Clothing', imageUrl: A[6],  addedBy: by },
      { id: '158', name: "Men's Tapered Jogger Pants",    description: 'French terry, elastic cuffs, drawstring, two hand pockets, S–XXL',             price: 49.99,   inventory: 90, category: 'Clothing', imageUrl: A[7],  addedBy: by },
      { id: '159', name: "Women's Relaxed Linen Shirt",   description: 'Breathable linen blend, oversized silhouette, chest pocket, roll-tab sleeve',  price: 49.99,   inventory: 80, category: 'Clothing', imageUrl: A[8],  addedBy: by },
      { id: '160', name: "Men's Full-Grain Leather Belt", description: '35mm wide, solid brass buckle, 8 hole sizes, 28"–44", tan or black',           price: 39.99,   inventory: 100, category: 'Clothing', imageUrl: A[9], addedBy: by },
      { id: '161', name: "Women's Cork Footbed Sandals",  description: 'Adjustable ankle strap, 2" block heel, vegan leather upper, 5–11 US',          price: 49.99,   inventory: 80, category: 'Clothing', imageUrl: A[0],  addedBy: by },
      { id: '162', name: "Men's Low-Top Canvas Sneakers", description: 'Vulcanized rubber sole, cotton canvas upper, 7 colorways, 7–14 US',            price: 54.99,   inventory: 90, category: 'Clothing', imageUrl: A[1],  addedBy: by },
      { id: '163', name: "Women's Cushioned Running Shoes", description: 'Responsive midsole, breathable mesh, reflective details, W6–12 US',         price: 89.99,   inventory: 75, category: 'Clothing', imageUrl: A[2],  addedBy: by },
      { id: '164', name: "Men's Leather Brogue Derby",    description: 'Full-grain leather, Goodyear welt, leather sole, UK6–12, 3 colors',            price: 119.99,  inventory: 40, category: 'Clothing', imageUrl: A[3],  addedBy: by },
      { id: '165', name: "Women's Block Heel Ankle Boot", description: 'Side zip, 1.5" block heel, faux suede, padded insole, 5–11 US',                price: 79.99,   inventory: 60, category: 'Clothing', imageUrl: A[4],  addedBy: by },
      { id: '166', name: "Men's Waterproof Trail Shoes",  description: 'Vibram Megagrip outsole, waterproof membrane, rock plate, M7–14 US',           price: 129.99,  inventory: 45, category: 'Clothing', imageUrl: A[5],  addedBy: by },
      { id: '167', name: "Women's Pointed-Toe Ballet Flats", description: 'Genuine leather, elastic topline, cushioned insole, 5–11 US',              price: 64.99,   inventory: 70, category: 'Clothing', imageUrl: A[6],  addedBy: by },
      { id: '168', name: "Men's Suede Penny Loafers",     description: 'Suede upper, rubber lug sole, classic penny slot, M7–13 US',                   price: 89.99,   inventory: 55, category: 'Clothing', imageUrl: A[7],  addedBy: by },
      { id: '169', name: "Unisex Platform High-Top Sneakers", description: '1.5" platform sole, canvas upper, lace-up, 4–13 US unisex sizing',        price: 74.99,   inventory: 65, category: 'Clothing', imageUrl: A[8],  addedBy: by },
      { id: '170', name: "Men's Insulated Winter Boots",  description: 'Waterproof shell, faux-fur lining, rated –30°C, non-slip, M7–14 US',           price: 149.99,  inventory: 30, category: 'Clothing', imageUrl: A[9],  addedBy: by },
      { id: '171', name: 'Unisex Baseball Cap 6-Panel',   description: '100% cotton twill, adjustable strap, embroidered logo, one size fits most',    price: 24.99,   inventory: 150, category: 'Clothing', imageUrl: A[0], addedBy: by },
      { id: '172', name: 'Knit Beanie with Pom-Pom',      description: 'Acrylic blend, ribbed cuff, fleece-lined, one size, 12 colors',                price: 19.99,   inventory: 200, category: 'Clothing', imageUrl: A[1], addedBy: by },
      { id: '173', name: '100% Silk Square Scarf',         description: 'Mulberry silk, 90cm x 90cm, hand-rolled edge, geometric print, gift box',     price: 89.99,   inventory: 40, category: 'Clothing', imageUrl: A[2],  addedBy: by },
      { id: '174', name: 'RFID Leather Bifold Wallet',     description: 'Full-grain cowhide, 8 card slots, bill compartment, RFID blocking lining',    price: 49.99,   inventory: 100, category: 'Clothing', imageUrl: A[3], addedBy: by },
      { id: '175', name: 'Polarized Aviator Sunglasses',   description: 'UV400 polycarbonate lens, lightweight metal frame, unisex, case included',    price: 59.99,   inventory: 85, category: 'Clothing', imageUrl: A[4],  addedBy: by },
      { id: '176', name: "Men's Minimalist Quartz Watch",  description: 'Sapphire glass, 36mm case, genuine leather strap, 50m water resistant',       price: 99.99,   inventory: 60, category: 'Clothing', imageUrl: A[5],  addedBy: by },
      { id: '177', name: 'Natural Cotton Canvas Tote',     description: '100% natural cotton, reinforced handles, inner zip pocket, 15L capacity',     price: 29.99,   inventory: 120, category: 'Clothing', imageUrl: A[6], addedBy: by },
      { id: '178', name: '45L Gym Duffel Bag',             description: 'Wet/dry compartment, shoe pocket, padded shoulder strap, ripstop nylon',      price: 49.99,   inventory: 90, category: 'Clothing', imageUrl: A[7],  addedBy: by },
      { id: '179', name: 'Unisex Packable Rain Jacket',    description: '100% waterproof, sealed seams, packable into chest pocket, hooded, XS–XXL',  price: 89.99,   inventory: 65, category: 'Clothing', imageUrl: A[8],  addedBy: by },
      { id: '180', name: "Men's Anti-Pill Fleece Jacket",  description: 'Full-zip, two hand pockets, inner chest pocket, stand collar, S–XXL',         price: 74.99,   inventory: 70, category: 'Clothing', imageUrl: A[9],  addedBy: by },
      { id: '181', name: "Women's Faux-Fur Gilet",         description: 'Sleeveless, open front, cozy winter layer, 4 muted tones, S–XL',              price: 79.99,   inventory: 50, category: 'Clothing', imageUrl: A[0],  addedBy: by },
      { id: '182', name: "Men's 3-Pack Ribbed Tank Tops",  description: '100% cotton rib, muscle fit, preshrunk, white/black/grey, S–XXL',             price: 29.99,   inventory: 150, category: 'Clothing', imageUrl: A[1], addedBy: by },
      { id: '183', name: "Women's Off-Shoulder Blouse",    description: 'Elasticated neck, flowy hem, chiffon, 3 earthy tones, S–XL',                  price: 34.99,   inventory: 100, category: 'Clothing', imageUrl: A[2], addedBy: by },
      { id: '184', name: "Men's 9-inch Board Shorts",          description: 'Quick-dry polyester, side cargo pocket, internal mesh lining, UPF 50',        price: 44.99,   inventory: 80, category: 'Clothing', imageUrl: A[3],  addedBy: by },
      { id: '185', name: "Women's Satin V-Neck Blouse",    description: 'Elegant drape, ¾ sleeve, back tie detail, machine washable, S–XL',            price: 59.99,   inventory: 75, category: 'Clothing', imageUrl: A[4],  addedBy: by },
      { id: '186', name: "Men's Slim Formal Trousers",     description: 'Stretch wool-look fabric, flat front, slim leg, unfinished hem, S–XXL',       price: 69.99,   inventory: 60, category: 'Clothing', imageUrl: A[5],  addedBy: by },
      { id: '187', name: "Women's Hooded Windbreaker",     description: 'Water-resistant, packable, adjustable hem & cuffs, front zip, XS–XL',         price: 64.99,   inventory: 70, category: 'Clothing', imageUrl: A[6],  addedBy: by },
      { id: '188', name: 'Unisex Varsity Letterman Jacket', description: 'Wool body, genuine leather sleeves, snap buttons, striped cuffs, S–XXL',    price: 149.99,  inventory: 30, category: 'Clothing', imageUrl: A[7],  addedBy: by },
      { id: '189', name: "Men's Merino Base Layer Set",    description: '100% merino top + bottom, temperature-regulating, odor-resistant, S–XXL',    price: 99.99,   inventory: 40, category: 'Clothing', imageUrl: A[8],  addedBy: by },
      { id: '190', name: "Women's Wrap-Front Midi Skirt",  description: 'Satin finish, A-line silhouette, elastic waist, knee length, XS–XL',          price: 44.99,   inventory: 85, category: 'Clothing', imageUrl: A[9],  addedBy: by },

      // ─── BOOKS (191–250) ──────────────────────────────────────────────
      { id: '191', name: 'Clean Code',                     description: 'Robert C. Martin — Best practices for writing readable, maintainable code',   price: 34.99,   inventory: 50, category: 'Books', imageUrl: A[0],  addedBy: by },
      { id: '192', name: 'The Pragmatic Programmer',       description: 'Hunt & Thomas — Career guide and philosophy for software craftspeople',        price: 39.99,   inventory: 45, category: 'Books', imageUrl: A[1],  addedBy: by },
      { id: '193', name: 'Design Patterns',                description: 'Gang of Four — 23 reusable solutions to common software design problems',      price: 44.99,   inventory: 40, category: 'Books', imageUrl: A[2],  addedBy: by },
      { id: '194', name: "You Don't Know JS",              description: 'Kyle Simpson — Deep dive into JavaScript scopes, closures, and prototypes',    price: 29.99,   inventory: 60, category: 'Books', imageUrl: A[3],  addedBy: by },
      { id: '195', name: 'Python Crash Course 3rd Ed',     description: 'Eric Matthes — Hands-on, project-based intro to Python programming',           price: 32.99,   inventory: 55, category: 'Books', imageUrl: A[4],  addedBy: by },
      { id: '196', name: 'JavaScript: The Good Parts',     description: 'Douglas Crockford — The most reliable and elegant subset of JavaScript',       price: 24.99,   inventory: 65, category: 'Books', imageUrl: A[5],  addedBy: by },
      { id: '197', name: 'Introduction to Algorithms',     description: 'Cormen, Leiserson, Rivest, Stein — The definitive CS algorithms textbook',     price: 69.99,   inventory: 25, category: 'Books', imageUrl: A[6],  addedBy: by },
      { id: '198', name: 'Structure and Interpretation of Computer Programs', description: 'Abelson & Sussman — MIT classic on computer programming fundamentals', price: 54.99, inventory: 30, category: 'Books', imageUrl: A[7], addedBy: by },
      { id: '199', name: 'Refactoring 2nd Edition',        description: 'Martin Fowler — Improving the design of existing code with practical patterns', price: 44.99,   inventory: 40, category: 'Books', imageUrl: A[8],  addedBy: by },
      { id: '200', name: 'The Art of Computer Programming Vol 1', description: 'Donald Knuth — Fundamental algorithms, the magnum opus of CS',          price: 79.99,   inventory: 20, category: 'Books', imageUrl: A[9],  addedBy: by },
      { id: '201', name: 'Zero to One',                    description: 'Peter Thiel — How to build companies that create genuinely new things',         price: 24.99,   inventory: 75, category: 'Books', imageUrl: A[0],  addedBy: by },
      { id: '202', name: 'The Lean Startup',               description: 'Eric Ries — Build-measure-learn loop for validated startup learning',           price: 22.99,   inventory: 80, category: 'Books', imageUrl: A[1],  addedBy: by },
      { id: '203', name: 'Good to Great',                  description: 'Jim Collins — Why some companies make the leap and others do not',              price: 19.99,   inventory: 90, category: 'Books', imageUrl: A[2],  addedBy: by },
      { id: '204', name: 'Thinking, Fast and Slow',        description: 'Daniel Kahneman — Dual system model of human decision-making and bias',         price: 17.99,   inventory: 100, category: 'Books', imageUrl: A[3], addedBy: by },
      { id: '205', name: 'Atomic Habits',                  description: 'James Clear — Tiny changes that compound into remarkable results over time',     price: 19.99,   inventory: 120, category: 'Books', imageUrl: A[4], addedBy: by },
      { id: '206', name: 'Deep Work',                      description: 'Cal Newport — Rules for focused success in an increasingly distracted world',   price: 18.99,   inventory: 100, category: 'Books', imageUrl: A[5], addedBy: by },
      { id: '207', name: 'The Subtle Art of Not Giving a F*ck', description: 'Mark Manson — Counterintuitive approach to living a good life',           price: 17.99,   inventory: 110, category: 'Books', imageUrl: A[6], addedBy: by },
      { id: '208', name: 'Rich Dad Poor Dad',              description: 'Robert Kiyosaki — What the wealthy teach their kids about money and investing',  price: 14.99,   inventory: 130, category: 'Books', imageUrl: A[7], addedBy: by },
      { id: '209', name: 'The 4-Hour Work Week',           description: 'Tim Ferriss — Escape the 9-5, live anywhere, and join the new rich',           price: 18.99,   inventory: 95, category: 'Books', imageUrl: A[8],  addedBy: by },
      { id: '210', name: 'Start With Why',                 description: 'Simon Sinek — How great leaders inspire action with the Golden Circle',         price: 17.99,   inventory: 100, category: 'Books', imageUrl: A[9], addedBy: by },
      { id: '211', name: 'Sapiens',                        description: 'Yuval Noah Harari — A brief history of humankind from stone age to today',      price: 22.99,   inventory: 85, category: 'Books', imageUrl: A[0],  addedBy: by },
      { id: '212', name: 'A Brief History of Time',        description: 'Stephen Hawking — From the big bang to black holes, cosmology explained',       price: 17.99,   inventory: 90, category: 'Books', imageUrl: A[1],  addedBy: by },
      { id: '213', name: 'Cosmos',                         description: 'Carl Sagan — Personal journey through the universe and the story of science',   price: 19.99,   inventory: 65, category: 'Books', imageUrl: A[2],  addedBy: by },
      { id: '214', name: 'The Selfish Gene',               description: 'Richard Dawkins — Evolution viewed through the lens of the gene, not organism', price: 16.99,   inventory: 70, category: 'Books', imageUrl: A[3],  addedBy: by },
      { id: '215', name: 'Guns, Germs, and Steel',         description: 'Jared Diamond — Why Eurasian civilizations came to dominate the world',         price: 19.99,   inventory: 65, category: 'Books', imageUrl: A[4],  addedBy: by },
      { id: '216', name: 'The Great Gatsby',               description: 'F. Scott Fitzgerald — Decadence and idealism in the Jazz Age American dream',   price: 12.99,   inventory: 100, category: 'Books', imageUrl: A[5], addedBy: by },
      { id: '217', name: 'To Kill a Mockingbird',          description: 'Harper Lee — Racial injustice and moral growth in the Depression-era South',    price: 14.99,   inventory: 90, category: 'Books', imageUrl: A[6],  addedBy: by },
      { id: '218', name: '1984',                           description: 'George Orwell — Haunting vision of totalitarianism, surveillance, and truth',   price: 13.99,   inventory: 110, category: 'Books', imageUrl: A[7], addedBy: by },
      { id: '219', name: 'Brave New World',                description: 'Aldous Huxley — Dystopian world of pleasure, conformity, and manufactured joy', price: 13.99,   inventory: 95, category: 'Books', imageUrl: A[8],  addedBy: by },
      { id: '220', name: "The Hitchhiker's Guide to the Galaxy", description: 'Douglas Adams — Comedic sci-fi classic: the answer is 42',              price: 14.99,   inventory: 85, category: 'Books', imageUrl: A[9],  addedBy: by },
      { id: '221', name: 'Dune',                           description: 'Frank Herbert — Epic sci-fi on the desert planet Arrakis and its messiah',      price: 18.99,   inventory: 80, category: 'Books', imageUrl: A[0],  addedBy: by },
      { id: '222', name: 'The Lord of the Rings',          description: 'J.R.R. Tolkien — Complete trilogy in one volume, the foundation of fantasy',    price: 29.99,   inventory: 60, category: 'Books', imageUrl: A[1],  addedBy: by },
      { id: '223', name: 'Harry Potter Boxed Set 1–7',     description: "J.K. Rowling — All seven books, hardcover boxed set with exclusive case",       price: 89.99,   inventory: 30, category: 'Books', imageUrl: A[2],  addedBy: by },
      { id: '224', name: 'The Alchemist',                  description: 'Paulo Coelho — Philosophical journey about following your personal legend',      price: 14.99,   inventory: 100, category: 'Books', imageUrl: A[3], addedBy: by },
      { id: '225', name: 'Project Hail Mary',              description: 'Andy Weir — Lone astronaut must save Earth, a thrilling sci-fi page-turner',    price: 18.99,   inventory: 70, category: 'Books', imageUrl: A[4],  addedBy: by },
      { id: '226', name: 'Salt Fat Acid Heat',             description: 'Samin Nosrat — Mastering the four elements of good cooking with illustrations', price: 29.99,   inventory: 55, category: 'Books', imageUrl: A[5],  addedBy: by },
      { id: '227', name: 'The Joy of Cooking 75th Anniv.', description: 'Rombauer & Becker — American cooking bible with 4,500 recipes, fully revised',  price: 34.99,   inventory: 45, category: 'Books', imageUrl: A[6],  addedBy: by },
      { id: '228', name: 'Jerusalem',                      description: 'Yotam Ottolenghi — Vibrant, bold flavors from the culinary crossroads city',    price: 39.99,   inventory: 35, category: 'Books', imageUrl: A[7],  addedBy: by },
      { id: '229', name: 'The Food Lab',                   description: 'J. Kenji López-Alt — Science behind better home cooking, 1000+ recipes',       price: 44.99,   inventory: 30, category: 'Books', imageUrl: A[8],  addedBy: by },
      { id: '230', name: 'Plenty More',                    description: 'Yotam Ottolenghi — Inventive, vegetable-forward cooking for every occasion',    price: 34.99,   inventory: 40, category: 'Books', imageUrl: A[9],  addedBy: by },
      { id: '231', name: 'Shoe Dog',                       description: "Phil Knight — Creator of Nike's raw memoir of building a global brand",         price: 18.99,   inventory: 80, category: 'Books', imageUrl: A[0],  addedBy: by },
      { id: '232', name: 'Steve Jobs',                     description: "Walter Isaacson — Definitive biography of Apple's visionary and perfectionist",  price: 22.99,   inventory: 70, category: 'Books', imageUrl: A[1],  addedBy: by },
      { id: '233', name: 'Elon Musk',                      description: 'Walter Isaacson — Inside Tesla, SpaceX, and the quest for a fantastic future',  price: 24.99,   inventory: 75, category: 'Books', imageUrl: A[2],  addedBy: by },
      { id: '234', name: 'The Innovators',                 description: 'Walter Isaacson — How hackers and geniuses created the digital revolution',      price: 22.99,   inventory: 65, category: 'Books', imageUrl: A[3],  addedBy: by },
      { id: '235', name: 'How to Win Friends and Influence People', description: 'Dale Carnegie — Timeless people skills still essential after 80 years', price: 14.99, inventory: 130, category: 'Books', imageUrl: A[4], addedBy: by },
      { id: '236', name: 'The Power of Now',               description: 'Eckhart Tolle — A guide to spiritual enlightenment through present-moment awareness', price: 15.99, inventory: 110, category: 'Books', imageUrl: A[5], addedBy: by },
      { id: '237', name: "Man's Search for Meaning",       description: "Viktor Frankl — Holocaust survivor's account of finding purpose through suffering", price: 14.99, inventory: 120, category: 'Books', imageUrl: A[6], addedBy: by },
      { id: '238', name: '12 Rules for Life',              description: 'Jordan Peterson — An antidote to chaos, from lobsters to the meaning of life',   price: 22.99,   inventory: 90, category: 'Books', imageUrl: A[7],  addedBy: by },
      { id: '239', name: 'Meditations',                    description: 'Marcus Aurelius — Private stoic journal of a Roman emperor, timeless wisdom',   price: 12.99,   inventory: 120, category: 'Books', imageUrl: A[8], addedBy: by },
      { id: '240', name: 'The Art of War',                 description: 'Sun Tzu — Ancient Chinese military strategy applied to business and life',       price: 9.99,    inventory: 150, category: 'Books', imageUrl: A[9], addedBy: by },
      { id: '241', name: 'Thinking in Systems',            description: 'Donella Meadows — An accessible primer on systems thinking and leverage points', price: 24.99,   inventory: 55, category: 'Books', imageUrl: A[0],  addedBy: by },
      { id: '242', name: 'The Black Swan',                 description: 'Nassim Taleb — Why highly improbable events dominate history and how to survive', price: 17.99,  inventory: 70, category: 'Books', imageUrl: A[1],  addedBy: by },
      { id: '243', name: 'Freakonomics',                   description: 'Levitt & Dubner — Rogue economists explore the hidden side of everything',       price: 16.99,   inventory: 80, category: 'Books', imageUrl: A[2],  addedBy: by },
      { id: '244', name: 'Outliers',                       description: 'Malcolm Gladwell — The story of success: why 10,000 hours and luck both matter', price: 17.99,  inventory: 85, category: 'Books', imageUrl: A[3],  addedBy: by },
      { id: '245', name: 'The Tipping Point',              description: 'Malcolm Gladwell — How little things can make a big difference in epidemics',    price: 16.99,   inventory: 80, category: 'Books', imageUrl: A[4],  addedBy: by },
      { id: '246', name: 'Thinking in Bets',               description: 'Annie Duke — Making smarter decisions when you do not have all the facts',       price: 18.99,   inventory: 70, category: 'Books', imageUrl: A[5],  addedBy: by },
      { id: '247', name: 'Never Split the Difference',     description: 'Chris Voss — FBI negotiation tactics applied to everyday business and life',     price: 19.99,   inventory: 75, category: 'Books', imageUrl: A[6],  addedBy: by },
      { id: '248', name: 'The Lean Six Sigma Pocket Toolbook', description: 'George & Rowlands — Quick reference for all key Lean Six Sigma tools',     price: 24.99,   inventory: 40, category: 'Books', imageUrl: A[7],  addedBy: by },
      { id: '249', name: 'Hooked',                         description: 'Nir Eyal — How to build habit-forming products using the Hook Model',           price: 18.99,   inventory: 65, category: 'Books', imageUrl: A[8],  addedBy: by },
      { id: '250', name: 'The Hard Thing About Hard Things', description: 'Ben Horowitz — Building a business when there are no easy answers',           price: 21.99,   inventory: 60, category: 'Books', imageUrl: A[9],  addedBy: by },
    ];

    const products = await ProductModel.insertMany(sampleProducts);
    console.log(`✅ Added ${products.length} products`);

    const byCategory = sampleProducts.reduce(
      (acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log('\n📦 Products by category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    console.log('\n🔐 Admin Credentials:');
    console.log('  Email: admin@quantumcommerce.com');
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
