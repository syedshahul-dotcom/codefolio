import { useState } from 'react';
import api from '../api';

export default function ContactForm({ username, preview }) {
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ senderName: '', senderEmail: '', message: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (preview) return;
    setStatus('sending');
    try {
      await api.post(`/portfolio/${username}/contact`, form);
      setStatus('sent');
      setForm({ senderName: '', senderEmail: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-row">
        <input name="senderName" placeholder="Your name" value={form.senderName} onChange={onChange} required maxLength={100} />
        <input name="senderEmail" type="email" placeholder="Your email" value={form.senderEmail} onChange={onChange} required maxLength={200} />
      </div>
      <textarea name="message" placeholder="Write a message..." rows={4} value={form.message} onChange={onChange} required maxLength={5000} />
      <button type="submit" disabled={status === 'sending' || preview}>
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </button>
      {status === 'sent' && <p className="contact-ok">Message sent. They'll reply to your email.</p>}
      {status === 'error' && <p className="contact-err">Something went wrong. Please try again.</p>}
      {preview && <p className="contact-preview-note">Contact form is disabled in preview.</p>}
    </form>
  );
}
