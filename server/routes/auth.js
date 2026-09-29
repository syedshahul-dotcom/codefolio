import { Router } from 'express';
import User from '../models/User.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      return res.status(400).json({ error: 'Username must be 3-30 chars: lowercase letters, numbers, underscore' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const reserved = ['api', 'admin', 'login', 'register', 'dashboard', 'assets'];
    if (reserved.includes(username)) {
      return res.status(400).json({ error: 'That username is reserved' });
    }
    if (await User.findOne({ $or: [{ username }, { email }] })) {
      return res.status(409).json({ error: 'Username or email already taken' });
    }

    const user = new User({ username, email });
    await user.setPassword(password);
    await user.save();
    res.status(201).json({ token: signToken(user), user: user.toPrivateJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const user = await User.findOne({
      $or: [{ username: (username || '').toLowerCase() }, { email: (username || '').toLowerCase() }]
    });
    if (!user || !(await user.checkPassword(password || ''))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ token: signToken(user), user: user.toPrivateJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user.toPrivateJSON() });
});

export default router;
