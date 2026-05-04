import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

const ADMIN_EMAIL = 'dakshikac2004chaudhary@gmail.com';

const roleForEmail = (email) => email?.toLowerCase() === ADMIN_EMAIL ? 'Admin' : 'Member';

const ensureConfiguredAdmin = async (user) => {
  if (user.email === ADMIN_EMAIL && user.role !== 'Admin') {
    user.role = 'Admin';
    await user.save();
  }
  return user;
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email: normalizedEmail, password, role: roleForEmail(normalizedEmail) });
    res.status(201).json({ success: true, user, token: generateToken(user._id) });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    user = await ensureConfiguredAdmin(user);
    res.json({ success: true, user, token: generateToken(user._id) });
  } catch (error) { next(error); }
};

export const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};
