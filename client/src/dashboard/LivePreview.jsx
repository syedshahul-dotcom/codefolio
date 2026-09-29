import { getTemplate } from '../templates/templateMap';

// Scaled-down live render of the selected template using the current form data.
export default function LivePreview({ data }) {
  const Layout = getTemplate(data.templateId);
  return (
    <div className="preview-frame">
      <div className="preview-bar">
        <span className="dot" /> <span className="dot" /> <span className="dot" />
        <code>codefolio.dev/{data.username || 'yourname'}</code>
      </div>
      <div className="preview-scroll">
        <div className="preview-scale">
          <Layout data={data} preview />
        </div>
      </div>
    </div>
  );
}
