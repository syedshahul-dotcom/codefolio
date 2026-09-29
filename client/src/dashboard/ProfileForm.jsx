export default function ProfileForm({ register }) {
  return (
    <section className="panel">
      <h2>Profile</h2>
      <div className="form-grid">
        <label>
          Full name
          <input {...register('profile.name')} placeholder="Jane Doe" />
        </label>
        <label>
          Headline
          <input {...register('profile.title')} placeholder="Full Stack Developer" />
        </label>
        <label>
          Location
          <input {...register('profile.location')} placeholder="Berlin, Germany" />
        </label>
        <label>
          Avatar URL
          <input {...register('profile.avatarUrl')} placeholder="https://..." />
        </label>
        <label className="span-2">
          Bio
          <textarea {...register('profile.bio')} rows={4} placeholder="A short intro about you..." />
        </label>
        <label>
          Resume URL
          <input {...register('profile.resumeUrl')} placeholder="https://..." />
        </label>
        <label>
          GitHub
          <input {...register('profile.socialLinks.github')} placeholder="https://github.com/..." />
        </label>
        <label>
          LinkedIn
          <input {...register('profile.socialLinks.linkedin')} placeholder="https://linkedin.com/in/..." />
        </label>
        <label>
          Twitter / X
          <input {...register('profile.socialLinks.twitter')} placeholder="https://twitter.com/..." />
        </label>
        <label>
          Personal website
          <input {...register('profile.socialLinks.website')} placeholder="https://..." />
        </label>
      </div>
    </section>
  );
}
