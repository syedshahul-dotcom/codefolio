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

export default function Corporate({ data, preview }) {
  const { profile, projects, skillGroups, isPro } = data;
  const socials = socialEntries(profile);

  return (
    <div className="tpl tpl-corp">
      <header className="corp-header">
        <div className="corp-header-inner">
          <div className="corp-avatar" aria-hidden="true">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" />
            ) : (
              (profile.name || data.username).charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1>
              {profile.name || data.username}
              {isPro && <span className="pro-badge corp-pro">PRO</span>}
            </h1>
            {profile.title && <p className="corp-title">{profile.title}</p>}
            {profile.location && <p className="corp-location">{profile.location}</p>}
            <div className="corp-actions">
              {profile.resumeUrl && (
                <a className="btn-corp" href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  View Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="corp-body">
        <main className="corp-main">
          {profile.bio && (
            <section className="corp-card">
              <h2>About</h2>
              <p>{profile.bio}</p>
            </section>
          )}

          {projects.length > 0 && (
            <section className="corp-card">
              <h2>Selected Projects</h2>
              <div className="corp-projects">
                {projects.map((p, i) => (
                  <article className="corp-project" key={p.title + i}>
                    {p.screenshot && <img src={p.screenshot} alt={p.title} loading="lazy" />}
                    <div>
                      <h3>{p.title}</h3>
                      {p.description && <p>{p.description}</p>}
                      {p.techStack.length > 0 && (
                        <div className="corp-tags">
                          {p.techStack.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="corp-links">
                        {p.repoLink && (
                          <a href={p.repoLink} target="_blank" rel="noreferrer">
                            Repository
                          </a>
                        )}
                        {p.liveLink && (
                          <a href={p.liveLink} target="_blank" rel="noreferrer">
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="corp-card">
            <h2>Contact</h2>
            <ContactForm username={data.username} preview={preview} />
          </section>
        </main>

        <aside className="corp-side">
          {skillGroups.length > 0 && (
            <div className="corp-card">
              <h2>Expertise</h2>
              {skillGroups.map((g) => (
                <div className="corp-skillgroup" key={g.category}>
                  <h3>{g.category}</h3>
                  <div className="corp-tags">
                    {g.skills.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {socials.length > 0 && (
            <div className="corp-card">
              <h2>Links</h2>
              <nav className="corp-socials">
                {socials.map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>
      </div>

      <footer className="corp-footer">
        Built with <a href="/">CodeFolio</a>
      </footer>
    </div>
  );
}
