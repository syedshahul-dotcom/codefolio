import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async ({ username, password }) => {
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Log in</h1>
        <label>
          Username or email
          <input {...register('username', { required: true })} autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" {...register('password', { required: true })} autoComplete="current-password" />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn" type="submit">
          Log in
        </button>
        <p className="auth-alt">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="hint">Demo login: username <code>demo1</code>, password <code>demo123</code></p>
      </form>
    </div>
  );
}
