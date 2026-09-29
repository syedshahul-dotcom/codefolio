import { TEMPLATES } from '../templates/templateMap';

export default function TemplatePicker({ value, onChange }) {
  return (
    <section className="panel">
      <h2>Template</h2>
      <div className="template-grid">
        {TEMPLATES.map((t) => (
          <button
            type="button"
            key={t.id}
            className={`template-card ${value === t.id ? 'selected' : ''}`}
            onClick={() => onChange(t.id)}
          >
            <span className={`template-swatch swatch-${t.id}`} aria-hidden="true" />
            <strong>{t.name}</strong>
            <small>{t.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
