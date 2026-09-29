import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../auth';
import { TEMPLATES } from '../templates/templateMap';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <Helmet>
        <title>CodeFolio - Your portfolio, built in minutes</title>
        <meta
          name="description"
          content="A no-code portfolio CMS for developers. Pick a template, add your projects, get a live site at codefolio.dev/yourname."
        />
      </Helmet>
      <nav className="nav">
        <span className="logo">CodeFolio</span>
        <div className="nav-links">
          {user ? (
            <Link to="/dashboard" className="btn">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      <header className="hero">
        <h1>Your portfolio, built in minutes — not weekends.</h1>
        <p>
          CodeFolio is a no-code CMS for developers. Add your projects, skills and links, pick a template, and get a
          live site at <code>codefolio.dev/yourname</code>.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-lg">
            Build your portfolio
          </Link>
          <Link to="/demo1" className="btn btn-ghost btn-lg">
            See a demo
          </Link>
        </div>
      </header>

      <section className="showcase">
        <h2>Showcase profiles</h2>
        <div className="showcase-grid">
          {TEMPLATES.map((t, i) => (
            <Link className="card" key={t.id} to={`/demo${i + 1}`}>
              <h3>/demo{i + 1}</h3>
              <p>
                <strong>{t.name}</strong> — {t.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>React · Node · Express · MongoDB — a Linktree on steroids for engineers.</p>
      </footer>
    </div>
  );
}
