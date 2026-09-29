import User from './models/User.js';

export const demoUsers = [
  {
    username: 'demo1',
    email: 'demo1@codefolio.dev',
    password: 'demo123',
    isPro: true,
    templateId: 'cyberpunk',
    profile: {
      name: 'Ada Lovelace',
      title: 'Full Stack Engineer',
      bio: 'I build neon-fast web apps and obsess over developer experience. Currently crafting distributed systems by day and synthwave side-projects by night.',
      avatarUrl: '',
      resumeUrl: 'https://example.com/ada-resume.pdf',
      location: 'London, UK',
      socialLinks: {
        github: 'https://github.com/ada',
        linkedin: 'https://linkedin.com/in/ada',
        twitter: 'https://twitter.com/ada',
        website: ''
      }
    },
    projects: [
      {
        title: 'NeonDB',
        description: 'A blazing-fast embedded key-value store with a web UI, built for edge deployments.',
        techStack: ['Rust', 'WebAssembly', 'TypeScript'],
        repoLink: 'https://github.com/ada/neondb',
        liveLink: 'https://neondb.example.com',
        screenshot: ''
      },
      {
        title: 'SynthChat',
        description: 'Realtime chat with end-to-end encryption and retro CRT aesthetics.',
        techStack: ['React', 'Node.js', 'WebSocket', 'Redis'],
        repoLink: 'https://github.com/ada/synthchat',
        liveLink: '',
        screenshot: ''
      }
    ],
    skillGroups: [
      { category: 'Frontend', skills: ['React', 'TypeScript', 'WebGL', 'Tailwind CSS'] },
      { category: 'Backend', skills: ['Node.js', 'Rust', 'PostgreSQL', 'Redis'] },
      { category: 'DevOps', skills: ['Docker', 'Cloudflare Workers', 'GitHub Actions'] }
    ]
  },
  {
    username: 'demo2',
    email: 'demo2@codefolio.dev',
    password: 'demo123',
    isPro: false,
    templateId: 'minimalist',
    profile: {
      name: 'Grace Hopper',
      title: 'Backend Engineer',
      bio: 'Compiler enthusiast. I write boring, reliable software on purpose. Ask me about queues.',
      avatarUrl: '',
      resumeUrl: '',
      location: 'New York, USA',
      socialLinks: {
        github: 'https://github.com/grace',
        linkedin: 'https://linkedin.com/in/grace',
        twitter: '',
        website: 'https://grace.example.com'
      }
    },
    projects: [
      {
        title: 'Queuely',
        description: 'A minimal job queue for Node.js with at-least-once delivery and a dashboard.',
        techStack: ['Node.js', 'MongoDB'],
        repoLink: 'https://github.com/grace/queuely',
        liveLink: 'https://queuely.example.com',
        screenshot: ''
      }
    ],
    skillGroups: [
      { category: 'Backend', skills: ['Node.js', 'Go', 'MongoDB', 'Kafka'] },
      { category: 'DevOps', skills: ['Kubernetes', 'Terraform', 'AWS'] }
    ]
  },
  {
    username: 'demo3',
    email: 'demo3@codefolio.dev',
    password: 'demo123',
    isPro: true,
    templateId: 'corporate',
    customDomain: null,
    profile: {
      name: 'Alan Turing',
      title: 'Staff Software Engineer',
      bio: 'Ten years shipping enterprise platforms at scale. I lead teams that turn ambiguous problems into dependable systems.',
      avatarUrl: '',
      resumeUrl: 'https://example.com/alan-cv.pdf',
      location: 'Manchester, UK',
      socialLinks: {
        github: 'https://github.com/alan',
        linkedin: 'https://linkedin.com/in/alan',
        twitter: '',
        website: ''
      }
    },
    projects: [
      {
        title: 'LedgerCore',
        description: 'Double-entry accounting engine processing 2M transactions daily for a fintech platform.',
        techStack: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL'],
        repoLink: '',
        liveLink: '',
        screenshot: ''
      },
      {
        title: 'Insight Portal',
        description: 'Executive analytics dashboard with role-based access and scheduled reporting.',
        techStack: ['React', 'Python', 'Snowflake'],
        repoLink: 'https://github.com/alan/insight-portal',
        liveLink: 'https://insight.example.com',
        screenshot: ''
      }
    ],
    skillGroups: [
      { category: 'Frontend', skills: ['React', 'Redux', 'Jest'] },
      { category: 'Backend', skills: ['Java', 'Python', 'gRPC', 'PostgreSQL'] },
      { category: 'DevOps', skills: ['AWS', 'Jenkins', 'Docker', 'Terraform'] }
    ]
  }
];

export async function seedDemoUsers({ log = console.log } = {}) {
  const created = [];
  for (const data of demoUsers) {
    const existing = await User.findOne({ username: data.username });
    if (existing) {
      log(`[seed] /${data.username} already exists - skipping`);
      continue;
    }
    const { password, ...rest } = data;
    const user = new User(rest);
    await user.setPassword(password);
    await user.save();
    created.push(user.username);
    log(`[seed] created showcase profile /${user.username} (template: ${user.templateId})`);
  }
  return created;
}

// Standalone run: node seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  const { connectDB, disconnectDB } = await import('./config/db.js');
  await connectDB();
  const created = await seedDemoUsers();
  console.log(created.length ? `[seed] done: ${created.join(', ')}` : '[seed] nothing to do');
  await disconnectDB();
  process.exit(0);
}
