import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { seedDemoUsers } from './seed.js';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import portfolioRoutes from './routes/portfolio.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'codefolio-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const { managed } = await connectDB();
// Seed showcase profiles only on a fresh, empty database. With a persistent store
// this runs once; existing (and user-edited) data is never touched on later boots.
if (managed && (await User.countDocuments()) === 0) {
  await seedDemoUsers();
}

app.listen(PORT, () => {
  console.log(`[api] CodeFolio API listening on http://localhost:${PORT}`);
  console.log('[api] showcase profiles: /demo1 (cyberpunk), /demo2 (minimalist), /demo3 (corporate)');
});
