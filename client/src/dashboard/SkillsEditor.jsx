export default function SkillsEditor({ control, register }) {
  const { fields, append, remove } = control.skillGroups;

  return (
    <section className="panel">
      <h2>Skills</h2>
      {fields.map((field, index) => (
        <div className="card-item" key={field.id}>
          <div className="form-grid">
            <label>
              Category
              <input {...register(`skillGroups.${index}.category`)} placeholder="Frontend" />
            </label>
            <label>
              Skills (comma-separated)
              <input {...register(`skillGroups.${index}.skills`)} placeholder="React, TypeScript, CSS" />
            </label>
          </div>
          <button type="button" className="btn-link danger" onClick={() => remove(index)}>
            Remove category
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost" onClick={() => append({ category: '', skills: '' })}>
        + Add category
      </button>
    </section>
  );
}
