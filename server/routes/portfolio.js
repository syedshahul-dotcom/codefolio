import { Router } from 'express';
import User from '../models/User.js';
import ContactMessage from '../models/ContactMessage.js';
import { sendContactEmail } from '../services/mailer.js';

const router = Router();

// Resolves a portfolio by username or by custom domain (Host header) for Pro users.
async function resolvePortfolio({ username, host }) {
  if (host) {
    const domain = host.split(':')[0].toLowerCase();
    const byDomain = await User.findOne({ customDomain: domain, isPro: true });
    if (byDomain) return byDomain;
  }
  if (!username) return null;
  return User.findOne({ username: username.toLowerCase() });
}

router.get('/:username', async (req, res) => {
  try {
    const user = await resolvePortfolio({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'Portfolio not found' });
    res.json({ portfolio: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load portfolio', detail: err.message });
  }
});

// Custom-domain entry point: GET /api/portfolio with Host: john.com
router.get('/', async (req, res) => {
  try {
    const user = await resolvePortfolio({ host: req.headers.host });
    if (!user) return res.status(404).json({ error: 'No portfolio mapped to this domain' });
    res.json({ portfolio: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load portfolio', detail: err.message });
  }
});

router.post('/:username/contact', async (req, res) => {
  try {
    const user = await resolvePortfolio({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'Portfolio not found' });

    const senderName = String(req.body?.senderName || '').trim().slice(0, 100);
    const senderEmail = String(req.body?.senderEmail || '').trim().slice(0, 200);
    const message = String(req.body?.message || '').trim().slice(0, 5000);

    if (!senderName || !message) return res.status(400).json({ error: 'Name and message are required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) return res.status(400).json({ error: 'A valid sender email is required' });

    const doc = await ContactMessage.create({
      recipient: user._id,
      senderName,
      senderEmail,
      message
    });

    try {
      const result = await sendContactEmail({
        to: user.email,
        ownerName: user.profile.name || user.username,
        senderName,
        senderEmail,
        message
      });
      doc.delivered = result.delivered;
      await doc.save();
    } catch (mailErr) {
      console.error('[contact] email delivery failed:', mailErr.message);
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message', detail: err.message });
  }
});

export default router;
