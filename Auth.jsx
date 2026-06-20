import React, { useState } from 'react';
import { Loader2, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { supabase } from './supabaseClient.js';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setConfirmSent(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(traduceError(err.message));
    } finally {
      setLoading(false);
    }
  };

  if (confirmSent) {
    return (
      <div className="auth-screen">
        <style>{AUTH_CSS}</style>
        <div className="auth-card">
          <CheckCircle2 size={40} color="#C8FF4D" strokeWidth={1.6} />
          <h2 className="auth-title">Revisa tu correo</h2>
          <p className="auth-text">
            Te hemos enviado un enlace de confirmación a <strong>{email}</strong>.
            Ábrelo para activar tu cuenta y luego vuelve aquí para iniciar sesión.
          </p>
          <button className="auth-btn auth-btn--ghost" onClick={() => { setConfirmSent(false); setMode('login'); }}>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <style>{AUTH_CSS}</style>
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-mark">PR</div>
          <div>
            <div className="auth-brand-title">PERF<em>LOG</em></div>
            <div className="auth-brand-sub">Cuaderno de rendimiento</div>
          </div>
        </div>

        <h2 className="auth-title">{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span><Mail size={14} /> Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </label>
          <label className="auth-field">
            <span><Lock size={14} /> Contraseña</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn auth-btn--primary" disabled={loading}>
            {loading ? <Loader2 className="spin" size={16} /> : (mode === 'login' ? 'Entrar' : 'Registrarme')}
          </button>
        </form>

        <button
          className="auth-switch"
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}

function traduceError(msg) {
  if (!msg) return 'Ha ocurrido un error. Inténtalo de nuevo.';
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.';
  if (msg.includes('User already registered')) return 'Ya existe una cuenta con ese email.';
  if (msg.includes('Password should be')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.includes('Email not confirmed')) return 'Confirma tu email antes de iniciar sesión (revisa tu bandeja de entrada).';
  return msg;
}

const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

.auth-screen {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: #14171A;
  padding: 20px;
  font-family: 'Oswald', sans-serif;
}
.auth-card {
  width: 100%; max-width: 380px;
  background: #1C2024;
  border: 1px solid #2A2F35;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
}
.auth-brand { display: flex; align-items: center; gap: 11px; margin-bottom: 22px; align-self: flex-start; }
.auth-brand-mark {
  width: 34px; height: 34px;
  background: #C8FF4D; color: #14171A;
  font-family: 'Bebas Neue', sans-serif; font-size: 15px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 7px;
}
.auth-brand-title { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1.3px; color: #E8E6E0; line-height: 1; text-align: left; }
.auth-brand-title em { color: #C8FF4D; font-style: normal; }
.auth-brand-sub { font-size: 9.5px; color: #5e6469; letter-spacing: 0.4px; text-transform: uppercase; margin-top: 2px; text-align: left; }

.auth-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #E8E6E0; letter-spacing: 0.5px; margin: 4px 0 18px; align-self: flex-start; }

.auth-form { width: 100%; display: flex; flex-direction: column; gap: 14px; }
.auth-field { display: flex; flex-direction: column; gap: 6px; text-align: left; }
.auth-field span { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #9aa0a8; }
.auth-field input {
  background: #20252A;
  border: 1px solid #2A2F35;
  border-radius: 9px;
  padding: 11px 12px;
  color: #E8E6E0;
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
}
.auth-field input:focus { outline: none; border-color: #C8FF4D; }

.auth-error {
  background: rgba(255,107,107,0.1);
  border: 1px solid rgba(255,107,107,0.3);
  color: #FF8A8A;
  font-size: 12px;
  padding: 9px 11px;
  border-radius: 8px;
  text-align: left;
  margin: 0;
}

.auth-btn {
  border-radius: 9px;
  padding: 12px 0;
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  border: 1px solid transparent;
  display: flex; align-items: center; justify-content: center;
}
.auth-btn--primary { background: #C8FF4D; color: #14171A; }
.auth-btn--primary:disabled { opacity: 0.6; }
.auth-btn--ghost { background: transparent; border-color: #2A2F35; color: #9aa0a8; margin-top: 18px; width: 100%; }

.auth-switch {
  background: none; border: none; color: #9aa0a8;
  font-size: 12.5px; margin-top: 18px; cursor: pointer;
  font-family: 'Oswald', sans-serif;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.auth-text { font-size: 13px; color: #9aa0a8; line-height: 1.6; margin: 6px 0 0; }
.auth-text strong { color: #E8E6E0; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`;
