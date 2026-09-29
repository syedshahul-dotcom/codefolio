import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api';
import { getTemplate } from '../templates/templateMap';
import '../styles/templates.css';

export default function PublicPortfolio() {
  const { username } = useParams();
  const [state, setState] = useState({ loading: true, portfolio: null, error: null });

  useEffect(() => {
    setState({ loading: true, portfolio: null, error: null });
    api
      .get(`/portfolio/${username}`)
      .then((res) => setState({ loading: false, portfolio: res.data.portfolio, error: null }))
      .catch(() => setState({ loading: false, portfolio: null, error: 'not found' }));
  }, [username]);

  if (state.loading) return <div className="page-status">Loading portfolio...</div>;

  if (state.error) {
    return (
      <div className="page-status">
        <h1>404</h1>
        <p>No portfolio found at /{username}</p>
        <Link to="/">Back to CodeFolio</Link>
        <p className="hint">
          Try a showcase profile: <Link to="/demo1">/demo1</Link>, <Link to="/demo2">/demo2</Link>, <Link to="/demo3">/demo3</Link>
        </p>
      </div>
    );
  }

  const data = state.portfolio;
  const PortfolioLayout = getTemplate(data.templateId);
  const title = `${data.profile.name || data.username} | ${data.profile.title || 'Developer Portfolio'}`;
  const description = (data.profile.bio || `${data.username}'s developer portfolio on CodeFolio`).slice(0, 160);

  return (
    <>
      <Helmet defer={false}>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      <PortfolioLayout data={data} />
    </>
  );
}
