const express = require('express');
const validator = require('validator');
const { rateLimit } = require('express-rate-limit');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { requireAuth } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

function text(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

router.post('/users', authLimiter, async (req, res, next) => {
  try {
    const name = text(req.body.name, 100);
    const email = text(req.body.email, 254).toLowerCase();
    const password = String(req.body.password ?? '');
    if (!name || !validator.isEmail(email) || password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: 'Valid name, email, and password of 8-128 characters are required' });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: 'An account with that email already exists' });
    next(error);
  }
});

router.post('/users/signin', authLimiter, async (req, res, next) => {
  try {
    const email = text(req.body.email, 254).toLowerCase();
    const password = String(req.body.password ?? '');
    if (!validator.isEmail(email) || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = user.getJWTToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
});

router.post('/users/signout', (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  res.json({ ok: true });
});

router.get('/users/me', requireAuth, (req, res) => res.json(req.user));

router.put('/users/:userid', requireAuth, async (req, res, next) => {
  try {
    if (String(req.user._id) !== req.params.userid) return res.status(403).json({ error: 'Forbidden' });
    const name = text(req.body.name, 100);
    const email = text(req.body.email, 254).toLowerCase();
    if (!name || !validator.isEmail(email)) return res.status(400).json({ error: 'Valid name and email are required' });
    const user = await User.findByIdAndUpdate(
      req.params.userid,
      { $set: { name, email } },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/products', async (_req, res, next) => {
  try { res.json(await Product.find().sort({ name: 1 })); } catch (error) { next(error); }
});

router.get('/products/:productid', async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.productid);
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json(item);
  } catch (error) { next(error); }
});

router.get('/reviews', async (_req, res, next) => {
  try {
    res.json(await Review.find().populate('user', 'name').populate('product', 'name').sort({ createdAt: -1 }).limit(100));
  } catch (error) { next(error); }
});

router.post('/reviews', requireAuth, async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    const title = text(req.body.title, 120);
    const comment = text(req.body.comment, 2000);
    const product = text(req.body.product, 100);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment || !product) {
      return res.status(400).json({ error: 'Valid product, rating (1-5), and comment are required' });
    }
    res.status(201).json(await Review.create({ product, rating, title, comment, user: req.user._id }));
  } catch (error) { next(error); }
});

router.get('/reviews/search', async (req, res, next) => {
  try {
    const productId = text(req.query.productId, 100);
    if (!productId) return res.status(400).json({ error: 'productId is required' });
    res.json(await Review.find({ product: productId }).populate('user', 'name').limit(100));
  } catch (error) { next(error); }
});

router.get('/reviews/usersearch', async (req, res, next) => {
  try {
    const userId = text(req.query.userId, 100);
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    res.json(await Review.find({ user: userId }).populate('product', 'name').limit(100));
  } catch (error) { next(error); }
});

router.delete('/reviews/:reviewid', requireAuth, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewid);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (String(review.user) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
    await review.deleteOne();
    res.json({ ok: true });
  } catch (error) { next(error); }
});

module.exports = router;
