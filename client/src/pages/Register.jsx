import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async ({ username, email, password }) => {
    setError('');
    try {
      await registerUser(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create your CodeFolio</h1>
        <label>
          Username (your URL: codefolio.dev/username)
          <input
            {...register('username', {
              required: true,
              pattern: { value: /^[a-z0-9_]{3,30}$/, message: '3-30 chars: lowercase letters, numbers, underscore' }
            })}
            autoComplete="username"
          />
          {errors.username && <span className="field-error">{errors.username.message}</span>}
        </label>
        <label>
          Email
          <input type="email" {...register('email', { required: true })} autoComplete="email" />
        </label>
        <label>
          Password
          <input
            type="password"
            {...register('password', { required: true, minLength: { value: 6, message: 'At least 6 characters' } })}
            autoComplete="new-password"
          />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn" type="submit">
          Sign up
        </button>
        <p className="auth-alt">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
