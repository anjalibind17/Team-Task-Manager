import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const ADMIN_EMAIL = 'dakshikac2004chaudhary@gmail.com';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authorized, token missing');
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    if (user.email === ADMIN_EMAIL && user.role !== 'Admin') {
      await User.updateOne({ _id: user._id }, { role: 'Admin' });
      user.role = 'Admin';
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(res.statusCode === 200 ? 401 : res.statusCode);
    next(error);
  }
};

export const requireGlobalAdmin = (req, res, next) => {
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};
