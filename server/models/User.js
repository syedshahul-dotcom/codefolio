import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  techStack: [{ type: String, trim: true }],
  repoLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  screenshot: { type: String, default: '' }
});

const skillGroupSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  skills: [{ type: String, trim: true }]
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9_]{3,30}$/
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isPro: { type: Boolean, default: false },
    customDomain: { type: String, default: null },
    templateId: { type: String, enum: ['minimalist', 'cyberpunk', 'corporate'], default: 'minimalist' },
    profile: {
      name: { type: String, default: '' },
      title: { type: String, default: '' },
      bio: { type: String, default: '' },
      avatarUrl: { type: String, default: '' },
      resumeUrl: { type: String, default: '' },
      location: { type: String, default: '' },
      socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        website: { type: String, default: '' }
      }
    },
    projects: { type: [projectSchema], default: [] },
    skillGroups: { type: [skillGroupSchema], default: [] }
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toPublicJSON = function () {
  return {
    username: this.username,
    isPro: this.isPro,
    customDomain: this.customDomain,
    templateId: this.templateId,
    profile: this.profile,
    projects: this.projects,
    skillGroups: this.skillGroups
  };
};

userSchema.methods.toPrivateJSON = function () {
  return { id: this._id, username: this.username, email: this.email, isPro: this.isPro, ...this.toPublicJSON() };
};

export default mongoose.model('User', userSchema);
