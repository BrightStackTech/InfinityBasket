import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import productRoutes from './src/routes/product.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import Admin from './src/models/admin.model.js';
import contactRoutes from './src/routes/contact.routes.js';
import messageRoutes from './src/routes/message.routes.js';
import bcrypt from 'bcryptjs';


dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL, // your frontend URL
  credentials: true
}));
app.use(express.json());

connectDB();


const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const existingAdmin = await Admin.findOne({ email: adminEmail });

if (!existingAdmin) {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await Admin.create({
    email: adminEmail,
    password: hashedPassword,
    isAdmin: true
  });
  console.log(`Admin user created: ${adminEmail}`);
} else {
  console.log(`Admin user already exists: ${adminEmail}`);
}

app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));