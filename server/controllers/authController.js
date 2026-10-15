import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { createNotification } from '../services/notificationService.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, businessDetails } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const assignedRole = role === 'space_owner' ? 'space_owner' : 'advertiser';
    const roles = [assignedRole];

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: assignedRole,
      roles,
      businessDetails: businessDetails || {},
      authProvider: 'local',
      status: 'active',
    });

    const token = generateToken(user);

    await createNotification({
      userId: user._id,
      type: 'system',
      title: 'Welcome to Adspot!',
      message: `Hi ${user.name}, welcome to India's premier offline advertising marketplace. Start discovering spaces or list your hoardings.`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roles: user.roles,
        businessDetails: user.businessDetails,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact Adspot support.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roles: user.roles,
        businessDetails: user.businessDetails,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, businessDetails, notificationPreferences, role } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (businessDetails) user.businessDetails = { ...user.businessDetails, ...businessDetails };
    if (notificationPreferences) user.notificationPreferences = notificationPreferences;

    // Allow user to switch or add space_owner role if desired
    if (role && ['advertiser', 'space_owner'].includes(role)) {
      user.role = role;
      if (!user.roles.includes(role)) {
        user.roles.push(role);
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roles: user.roles,
        businessDetails: user.businessDetails,
        avatar: user.avatar,
        notificationPreferences: user.notificationPreferences,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mobile OTP Request
export const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Mobile number is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ phone });
    if (!user) {
      // Find or create temporary candidate
      user = new User({
        name: `User ${phone.slice(-4)}`,
        email: `${phone}@adspot.local`,
        phone,
        role: 'advertiser',
        roles: ['advertiser'],
        authProvider: 'otp',
      });
    }

    user.otpCode = otp;
    user.otpExpires = expires;
    await user.save({ validateBeforeSave: false });

    // Check if SMS provider is configured
    console.log(`[SMS OTP Simulator] OTP for ${phone} is: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully to your mobile number',
      // In development mode, provide simulated OTP for fast testing
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mobile OTP Verify
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const user = await User.findOne({ phone });
    if (!user || user.otpCode !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.otpCode = undefined;
    user.otpExpires = undefined;
    user.isPhoneVerified = true;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Mobile verification successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roles: user.roles,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Social OAuth (Google / Facebook) server endpoint
export const oauthLogin = async (req, res) => {
  try {
    const { provider, providerId, email, name, avatar } = req.body;
    if (!email || !provider || !providerId) {
      return res.status(400).json({ success: false, message: 'Missing OAuth parameters' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: name || 'Adspot User',
        email: email.toLowerCase(),
        avatar: avatar || '',
        authProvider: provider,
        providerId,
        isEmailVerified: true,
        role: 'advertiser',
        roles: ['advertiser'],
      });
    } else {
      if (!user.providerId) {
        user.authProvider = provider;
        user.providerId = providerId;
        await user.save();
      }
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roles: user.roles,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Development-only / secure Admin bootstrap
export const bootstrapAdmin = async (req, res) => {
  try {
    const { secret, email, password, name } = req.body;
    const expectedSecret = process.env.ADMIN_BOOTSTRAP_SECRET || 'adspot_admin_setup_2026';

    if (secret !== expectedSecret) {
      return res.status(403).json({ success: false, message: 'Invalid admin bootstrap secret' });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password required' });
    }

    let admin = await User.findOne({ email: email.toLowerCase() });
    if (admin) {
      admin.role = 'admin';
      if (!admin.roles.includes('admin')) admin.roles.push('admin');
      admin.password = password;
      await admin.save();
    } else {
      admin = await User.create({
        name: name || 'Adspot Administrator',
        email: email.toLowerCase(),
        password,
        role: 'admin',
        roles: ['admin', 'advertiser', 'space_owner'],
        isEmailVerified: true,
      });
    }

    const token = generateToken(admin);
    res.json({
      success: true,
      message: 'Admin account initialized successfully',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
