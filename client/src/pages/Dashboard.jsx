import { Component, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api';
import { useAuth } from '../auth';
import ProfileForm from '../dashboard/ProfileForm';
import ProjectsEditor from '../dashboard/ProjectsEditor';
import SkillsEditor from '../dashboard/SkillsEditor';
import TemplatePicker from '../dashboard/TemplatePicker';
import LivePreview from '../dashboard/LivePreview';
import '../styles/templates.css';

const splitList = (s) =>
  String(s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

function toFormValues(user) {
  return {
    profile: {
      name: user.profile?.name || '',
      title: user.profile?.title || '',
      bio: user.profile?.bio || '',
      avatarUrl: user.profile?.avatarUrl || '',
      resumeUrl: user.profile?.resumeUrl || '',
      location: user.profile?.location || '',
      socialLinks: {
        github: user.profile?.socialLinks?.github || '',
        linkedin: user.profile?.socialLinks?.linkedin || '',
        twitter: user.profile?.socialLinks?.twitter || '',
        website: user.profile?.socialLinks?.website || ''
      }
    },
    projects: (user.projects || []).map((p) => ({ ...p, techStack: (p.techStack || []).join(', ') })),
    skillGroups: (user.skillGroups || []).map((g) => ({ ...g, skills: (g.skills || []).join(', ') })),
    templateId: user.templateId || 'minimalist',
    customDomain: user.customDomain || '',
    isPro: !!user.isPro
  };
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="panel" style={{ color: '#f87171' }}>
          <strong>{this.props.name} crashed:</strong> {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Dashboard() {
  const { user, setUser, logout } = useAuth();
  const [status, setStatus] = useState({ saving: false, message: '', error: '' });

  const { register, control, handleSubmit, watch, setValue } = useForm({ defaultValues: toFormValues(user) });

  const projectsArray = useFieldArray({ control, name: 'projects' });
  const skillGroupsArray = useFieldArray({ control, name: 'skillGroups' });

  const formState = watch();

  const previewData = useMemo(
    () => ({
      username: user.username,
      isPro: formState.isPro,
      templateId: formState.templateId,
      profile: formState.profile,
      projects: (formState.projects || []).map((p) => ({ ...p, techStack: splitList(p.techStack) })),
      skillGroups: (formState.skillGroups || [])
        .filter((g) => g && g.category)
        .map((g) => ({ category: g.category, skills: splitList(g.skills) }))
    }),
    [formState, user.username]
  );

  const onSubmit = async (values) => {
    setStatus({ saving: true, message: '', error: '' });
    try {
      const payload = {
        profile: values.profile,
        projects: values.projects.map((p) => ({ ...p, techStack: splitList(p.techStack) })),
        skillGroups: values.skillGroups
          .filter((g) => g && g.category)
          .map((g) => ({ category: g.category, skills: splitList(g.skills) })),
        templateId: values.templateId,
        isPro: values.isPro
      };
      if (values.isPro) payload.customDomain = values.customDomain || null;
      const res = await api.put('/dashboard', payload);
      setUser(res.data.user);
      setStatus({ saving: false, message: 'Saved. Your portfolio is live!', error: '' });
    } catch (err) {
      setStatus({ saving: false, message: '', error: err.response?.data?.error || 'Save failed' });
    }
  };

  return (
    <div className="dashboard">
      <Helmet>
        <title>Dashboard | CodeFolio</title>
      </Helmet>
      <nav className="nav">
        <Link to="/" className="logo">
          CodeFolio
        </Link>
        <div className="nav-links">
          <Link to={`/${user.username}`} target="_blank" className="btn btn-ghost">
            View live site
          </Link>
          <button className="btn-link" onClick={logout}>
            Log out
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        <div className="dashboard-forms">
          <form onSubmit={handleSubmit(onSubmit)} id="portfolio-form">
            <div className="panel">
              <h2>
                Your URL: <code>/{user.username}</code>
              </h2>
              <label className="checkbox-label">
                <input type="checkbox" {...register('isPro')} />
                Pro account (custom domains + PRO badge)
              </label>
              {formState.isPro && (
                <label className="pro-domain">
                  Custom domain
                  <input {...register('customDomain')} placeholder="john.com" />
                  <small>Point a CNAME at codefolio.dev and enter your domain here.</small>
                </label>
              )}
            </div>
            <TemplatePicker value={formState.templateId} onChange={(id) => setValue('templateId', id)} />
            <ProfileForm register={register} />
            <ErrorBoundary name="ProjectsEditor">
              <ProjectsEditor register={register} control={{ projects: projectsArray }} />
            </ErrorBoundary>
            <ErrorBoundary name="SkillsEditor">
              <SkillsEditor register={register} control={{ skillGroups: skillGroupsArray }} />
            </ErrorBoundary>
          </form>

          <div className="save-bar">
            {status.message && <span className="save-ok">{status.message}</span>}
            {status.error && <span className="save-err">{status.error}</span>}
            <button className="btn btn-lg" type="submit" form="portfolio-form" disabled={status.saving}>
              {status.saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>

        <div className="dashboard-preview">
          <h3 className="preview-label">Live preview</h3>
          <LivePreview data={previewData} />
        </div>
      </div>
    </div>
  );
}
