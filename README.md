# CodeFolio

A no-code portfolio CMS for developers — "Linktree on steroids" for engineers. Fill in a dashboard, pick a template, and get a live portfolio at `codefolio.dev/yourname`.

Built with **React (Vite) · Node.js · Express · MongoDB · React Hook Form · React Helmet · Nodemailer**.

## Run it

Requires Node 18+. Two terminals:

```bash
# 1. API server (http://localhost:5000)
cd server
npm install
npm start          # uses MONGO_URI from .env if set, otherwise an in-memory MongoDB (auto-seeded)

# 2. Frontend (http://localhost:5173, proxies /api to :5000)
cd client
npm install
npm run dev
```

Open **http://localhost:5173**.

### Showcase profiles (pre-seeded)

| URL | Template | Notes |
|---|---|---|
| [/demo1](http://localhost:5173/demo1) | Cyberpunk | Pro account, PRO badge |
| [/demo2](http://localhost:5173/demo2) | Minimalist | Free account |
| [/demo3](http://localhost:5173/demo3) | Corporate | Pro account |

Demo login: username `demo1`, password `demo123` (also `demo2` / `demo3`).

### Configuration

Copy `server/.env.example` to `server/.env`:

- `MONGO_URI` — a real MongoDB connection string. If unset, the server boots an **in-memory MongoDB** (data resets on restart; demo users are auto-seeded).
- `JWT_SECRET` — set in production.
- `SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM` — contact-form delivery via Nodemailer. If unset, emails are logged to the server console instead (the message is still stored).

## Architecture

```
server/                 Express API
  models/User.js        profile, projects[], skillGroups[], templateId, isPro, customDomain
  models/ContactMessage.js
  routes/auth.js        register / login / me (JWT)
  routes/dashboard.js   PUT /api/dashboard  (auth-protected, saves portfolio data)
  routes/portfolio.js   GET /api/portfolio/:username, POST /api/portfolio/:username/contact
  services/mailer.js    Nodemailer wrapper with console fallback
  seed.js               demo1/demo2/demo3 showcase profiles

client/src/
  pages/                Home, Login, Register, Dashboard (CMS), PublicPortfolio
  dashboard/            ProfileForm, ProjectsEditor, SkillsEditor, TemplatePicker, LivePreview
  templates/            templateMap + Minimalist, Cyberpunk, Corporate  (public portfolio layouts)
```

Dashboard components and public portfolio components are fully separated; templates are the only shared UI and receive a single `data` prop.

### Template engine

`templateId` is stored on the user. The public page resolves a layout from a map and passes the DB document in:

```jsx
const PortfolioLayout = templateMap[data.templateId] || Minimalist;
return <PortfolioLayout data={data} />;
```

The dashboard's **Live Preview** renders the exact same components at 66% scale, driven by React Hook Form's `watch()` — so what you edit is literally the production template.

## System Design Note: how `/:username` routing works

**Both layers cooperate — React Router handles the URL, the backend handles the data:**

1. **Frontend (React Router):** the SPA is served for all paths, with a catch-all route `<Route path="/:username" element={<PublicPortfolio />} />` declared *after* the fixed routes (`/`, `/login`, `/dashboard`). Reserved words (`api`, `admin`, ...) are rejected at registration so usernames can never collide with app routes.
2. **Backend (Express data route):** `PublicPortfolio` reads `useParams().username` and calls `GET /api/portfolio/:username`, which looks the user up in MongoDB and returns only the public projection (no email, no password hash). Unknown usernames get a JSON 404, and the SPA renders a friendly 404 page with links to the showcase profiles.
3. **Custom domains (Pro):** the backend also exposes `GET /api/portfolio` (no username), which resolves the portfolio from the `Host` header against `customDomain`. In production you point a CNAME at the app; the same SPA loads and resolves data by host.
4. **SEO:** since this is client-rendered, `react-helmet-async` sets `<title>`, meta description, and Open Graph tags per portfolio from the user's name/title/bio after data loads. (A production hardening step would be SSR/prerendering for crawlers that don't execute JS.)

**Why not backend routing for the HTML?** Serving the SPA shell for every path keeps one deployment artifact and lets React Router own in-app navigation (no full page reloads between portfolios), while Express stays a pure JSON API. The tradeoff is SEO depends on JS execution — acceptable for this project, mitigated with Helmet, and solvable later with prerendering.

## Premium features

- **Pro badge + custom domains** — toggled on the dashboard; non-Pro users are rejected (403) when setting `customDomain`.
- **Contact form** — on every portfolio. Messages are stored in `ContactMessage` and forwarded to the owner's email via Nodemailer with `Reply-To` set to the visitor, so the owner's address is never exposed publicly.
