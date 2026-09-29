import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const TEMPLATES = ['minimalist', 'cyberpunk', 'corporate'];

function sanitizeLinks(links = {}) {
  return {
    github: String(links.github || '').slice(0, 300),
    linkedin: String(links.linkedin || '').slice(0, 300),
    twitter: String(links.twitter || '').slice(0, 300),
    website: String(links.website || '').slice(0, 300)
  };
}

router.put('/', requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { profile, projects, skillGroups, templateId, customDomain, isPro } = req.body || {};

    if (profile) {
      user.profile = {
        name: String(profile.name || '').slice(0, 100),
        title: String(profile.title || '').slice(0, 150),
        bio: String(profile.bio || '').slice(0, 2000),
        avatarUrl: String(profile.avatarUrl || '').slice(0, 500),
        resumeUrl: String(profile.resumeUrl || '').slice(0, 500),
        location: String(profile.location || '').slice(0, 100),
        socialLinks: sanitizeLinks(profile.socialLinks)
      };
    }

    if (Array.isArray(projects)) {
      user.projects = projects.slice(0, 30).map((p) => ({
        title: String(p.title || '').slice(0, 120),
        description: String(p.description || '').slice(0, 1000),
        techStack: Array.isArray(p.techStack) ? p.techStack.slice(0, 15).map((t) => String(t).slice(0, 40)) : [],
        repoLink: String(p.repoLink || '').slice(0, 500),
        liveLink: String(p.liveLink || '').slice(0, 500),
        screenshot: String(p.screenshot || '').slice(0, 500)
      }));
    }

    if (Array.isArray(skillGroups)) {
      user.skillGroups = skillGroups
        .slice(0, 10)
        .filter((g) => g && g.category)
        .map((g) => ({
          category: String(g.category).slice(0, 60),
          skills: Array.isArray(g.skills) ? g.skills.slice(0, 30).map((s) => String(s).slice(0, 40)) : []
        }));
    }

    if (templateId !== undefined) {
      if (!TEMPLATES.includes(templateId)) {
        return res.status(400).json({ error: `templateId must be one of: ${TEMPLATES.join(', ')}` });
      }
      user.templateId = templateId;
    }

    if (customDomain !== undefined) {
      if (customDomain && !user.isPro) {
        return res.status(403).json({ error: 'Custom domains are a Pro feature' });
      }
      user.customDomain = customDomain ? String(customDomain).toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').slice(0, 200) : null;
    }

    if (typeof isPro === 'boolean') user.isPro = isPro;

    await user.save();
    res.json({ user: user.toPrivateJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save portfolio', detail: err.message });
  }
});

export default router;
