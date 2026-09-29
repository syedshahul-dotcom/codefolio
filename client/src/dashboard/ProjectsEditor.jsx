export default function ProjectsEditor({ control, register }) {
  const { fields, append, remove } = control.projects;

  return (
    <section className="panel">
      <h2>Projects</h2>
      {fields.map((field, index) => (
        <div className="card-item" key={field.id}>
          <div className="card-item-head">
            <strong>Project {index + 1}</strong>
            <button type="button" className="btn-link danger" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
          <div className="form-grid">
            <label>
              Title
              <input {...register(`projects.${index}.title`)} placeholder="My Awesome App" />
            </label>
            <label>
              Tech stack (comma-separated)
              <input {...register(`projects.${index}.techStack`)} placeholder="React, Node.js, MongoDB" />
            </label>
            <label className="span-2">
              Description
              <textarea {...register(`projects.${index}.description`)} rows={2} />
            </label>
            <label>
              Repo link
              <input {...register(`projects.${index}.repoLink`)} placeholder="https://github.com/..." />
            </label>
            <label>
              Live link
              <input {...register(`projects.${index}.liveLink`)} placeholder="https://..." />
            </label>
            <label className="span-2">
              Screenshot URL
              <input {...register(`projects.${index}.screenshot`)} placeholder="https://..." />
            </label>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() =>
          append({ title: '', description: '', techStack: '', repoLink: '', liveLink: '', screenshot: '' })
        }
      >
        + Add project
      </button>
    </section>
  );
}
