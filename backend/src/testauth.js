import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected');

// Force delete all users
const deleted = await User.deleteMany({});
console.log('Deleted users:', deleted.deletedCount);

// Create one user with correct hash
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash('password123', salt);
console.log('New hash:', hash.substring(0, 20));

await User.collection.insertOne({
  name: 'Alice Johnson',
  email: 'alice@taskflow.com',
  password: hash,
  role: 'Admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Verify
const u = await User.findOne({ email: 'alice@taskflow.com' }).select('+password');
const match = await bcrypt.compare('password123', u.password);
console.log('Password match after insert:', match);

process.exit(0);
