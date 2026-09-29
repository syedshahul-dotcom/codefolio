import ContactForm from './ContactForm';

function socialEntries(profile) {
  const links = profile.socialLinks || {};
  return [
    ['GitHub', links.github],
    ['LinkedIn', links.linkedin],
    ['Twitter / X', links.twitter],
    ['Website', links.website]
  ].filter(([, url]) => url);
}

export default function Minimalist({ data, preview }) {
  const { profile, projects, skillGroups, isPro } = data;
  const socials = socialEntries(profile);

  return (
    <div className="tpl tpl-min">
      <header className="min-header">
        <div>
          <h1>
            {profile.name || data.username}
            {isPro && <span className="pro-badge">PRO</span>}
          </h1>
          {profile.title && <p className="min-title">{profile.title}</p>}
          {profile.location && <p className="min-location">{profile.location}</p>}
        </div>
        <div className="min-actions">
          {profile.resumeUrl && (
            <a className="btn-min" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Resume
            </a>
          )}
        </div>
      </header>

      {profile.bio && <p className="min-bio">{profile.bio}</p>}

      {socials.length > 0 && (
        <nav className="min-socials">
          {socials.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </nav>
      )}

      {skillGroups.length > 0 && (
        <section>
          <h2>Skills</h2>
          {skillGroups.map((g) => (
            <div className="min-skillgroup" key={g.category}>
              <h3>{g.category}</h3>
              <ul>
                {g.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2>Projects</h2>
          <div className="min-projects">
            {projects.map((p, i) => (
              <article className="min-project" key={p.title + i}>
                {p.screenshot && <img src={p.screenshot} alt={p.title} loading="lazy" />}
                <h3>{p.title}</h3>
                {p.description && <p>{p.description}</p>}
                {p.techStack.length > 0 && <p className="min-tech">{p.techStack.join(' · ')}</p>}
                <div className="min-links">
                  {p.repoLink && (
                    <a href={p.repoLink} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  )}
                  {p.liveLink && (
                    <a href={p.liveLink} target="_blank" rel="noreferrer">
                      Live
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Contact</h2>
        <ContactForm username={data.username} preview={preview} />
      </section>

      <footer className="min-footer">
        Built with <a href="/">CodeFolio</a>
      </footer>
    </div>
  );
}
