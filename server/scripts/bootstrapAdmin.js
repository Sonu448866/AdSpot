import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';

const bootstrap = async () => {
  const email = process.argv[2] || 'admin@adspot.com';
  const password = process.argv[3] || 'Admin@123456';
  const name = process.argv[4] || 'Adspot Super Admin';

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adspot';
    await mongoose.connect(mongoUri);

    let admin = await User.findOne({ email: email.toLowerCase() });
    if (admin) {
      admin.role = 'admin';
      if (!admin.roles.includes('admin')) admin.roles.push('admin');
      admin.password = password;
      await admin.save();
      console.log(`[Admin Bootstrap] Existing user ${email} upgraded to administrator with provided password.`);
    } else {
      admin = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'admin',
        roles: ['admin', 'advertiser', 'space_owner'],
        isEmailVerified: true,
      });
      console.log(`[Admin Bootstrap] New admin user created: ${email}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('[Admin Bootstrap Error]', err.message);
    process.exit(1);
  }
};

bootstrap();
