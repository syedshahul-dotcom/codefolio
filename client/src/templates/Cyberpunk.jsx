import ContactForm from './ContactForm';

function socialEntries(profile) {
  const links = profile.socialLinks || {};
  return [
    ['GITHUB', links.github],
    ['LINKEDIN', links.linkedin],
    ['TWITTER', links.twitter],
    ['WEB', links.website]
  ].filter(([, url]) => url);
}

export default function Cyberpunk({ data, preview }) {
  const { profile, projects, skillGroups, isPro } = data;
  const socials = socialEntries(profile);

  return (
    <div className="tpl tpl-cyber">
      <div className="cyber-grid" aria-hidden="true" />
      <header className="cyber-header">
        <p className="cyber-kicker">&gt; initializing profile...</p>
        <h1 className="glitch" data-text={profile.name || data.username}>
          {profile.name || data.username}
          {isPro && <span className="pro-badge cyber-pro">PRO</span>}
        </h1>
        {profile.title && <p className="cyber-title">[{profile.title}]</p>}
        {profile.location && <p className="cyber-location">// {profile.location}</p>}
        <div className="cyber-actions">
          {profile.resumeUrl && (
            <a className="btn-cyber" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              DOWNLOAD_RESUME
            </a>
          )}
        </div>
      </header>

      {profile.bio && <p className="cyber-bio">{profile.bio}</p>}

      {socials.length > 0 && (
        <nav className="cyber-socials">
          {socials.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </nav>
      )}

      {skillGroups.length > 0 && (
        <section className="cyber-section">
          <h2>&lt;SKILLS /&gt;</h2>
          <div className="cyber-skillgroups">
            {skillGroups.map((g) => (
              <div className="cyber-skillgroup" key={g.category}>
                <h3>{g.category}</h3>
                <div className="cyber-tags">
                  {g.skills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="cyber-section">
          <h2>&lt;PROJECTS /&gt;</h2>
          <div className="cyber-projects">
            {projects.map((p, i) => (
              <article className="cyber-project" key={p.title + i}>
                {p.screenshot && <img src={p.screenshot} alt={p.title} loading="lazy" />}
                <h3>{p.title}</h3>
                {p.description && <p>{p.description}</p>}
                {p.techStack.length > 0 && (
                  <div className="cyber-tags">
                    {p.techStack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                )}
                <div className="cyber-links">
                  {p.repoLink && (
                    <a href={p.repoLink} target="_blank" rel="noreferrer">
                      [SOURCE]
                    </a>
                  )}
                  {p.liveLink && (
                    <a href={p.liveLink} target="_blank" rel="noreferrer">
                      [LIVE]
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="cyber-section">
        <h2>&lt;TRANSMIT /&gt;</h2>
        <ContactForm username={data.username} preview={preview} />
      </section>

      <footer className="cyber-footer">
        POWERED BY <a href="/">CODEFOLIO</a> // 2077
      </footer>
    </div>
  );
}
