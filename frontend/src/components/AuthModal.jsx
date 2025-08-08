import React, { useState } from 'react';
import API from '../api';
import { BiShow, BiHide } from 'react-icons/bi';

const AuthModal = ({ closeModal, setUser }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: '', otp: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (mode === 'login') {
        res = await API.post('/auth/login', { email: form.email, password: form.password });
      } else if (mode === 'signup') {
        res = await API.post('/auth/signup', form);
      }
      if (res) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        closeModal();
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Something went wrong.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/forgot-password', { email: resetEmail });
      setOtpSent(true);
      setOtpForm({ ...otpForm, email: resetEmail });
      alert('OTP sent to your email.');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to send reset link.');
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/verify-otp-reset', otpForm);
      alert(res.data.msg);
      setOtpSent(false);
      switchMode('login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to reset password');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({ name: '', phone: '', email: '', password: '' });
    setResetEmail('');
    setOtpSent(false);
    setOtpForm({ email: '', otp: '', newPassword: '' });
    setShowPassword(false);
  };

  return (
    <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <form
          className="modal-content"
          onSubmit={
            mode === 'forgot'
              ? otpSent
                ? handleVerifyOtpSubmit
                : handleForgotPasswordSubmit
              : handleSubmit
          }
        >
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === 'login' ? 'Login' : mode === 'signup' ? 'Signup' : 'Forgot Password'}
            </h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>

          <div className="modal-body">
            {mode === 'signup' && (
              <>
                <div className="mb-3">
                  <label>Name</label>
                  <input
                    className="form-control"
                    name="name"
                    onChange={handleChange}
                    value={form.name}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    onChange={handleChange}
                    value={form.phone}
                    required
                  />
                </div>
              </>
            )}

            {mode === 'forgot' ? (
              !otpSent ? (
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label>OTP</label>
                    <input
                      type="text"
                      className="form-control"
                      value={otpForm.otp}
                      onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3 position-relative">
                    <label>New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={otpForm.newPassword}
                      onChange={(e) =>
                        setOtpForm({ ...otpForm, newPassword: e.target.value })
                      }
                      required
                    />
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '1.2rem',
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setShowPassword((prev) => !prev);
                        }
                      }}
                    >
                      {showPassword ? <BiHide /> : <BiShow />}
                    </span>
                  </div>
                </>
              )
            ) : (
              <>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                    value={form.email}
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label>Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    name="password"
                    onChange={handleChange}
                    value={form.password}
                    required
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      top: '65%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                      fontSize: '1.2rem',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowPassword((prev) => !prev);
                      }
                    }}
                  >
                    {showPassword ? <BiHide /> : <BiShow />}
                  </span>
                </div>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => switchMode('forgot')}
                  >
                    Forgot Password?
                  </button>
                )}
              </>
            )}
          </div>

          <div className="modal-footer flex-column">
            <div className="d-flex justify-content-between w-100">
              {mode !== 'forgot' && (
                <button type="submit" className="btn btn-success">
                  {mode === 'login' ? 'Login' : 'Signup'}
                </button>
              )}
              {mode === 'forgot' && (
                <button type="submit" className="btn btn-warning">
                  {otpSent ? 'Reset Password' : 'Send OTP'}
                </button>
              )}
              <div className="d-flex flex-column text-right">
                {mode === 'login' && (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => switchMode('signup')}
                  >
                    Don't have an account? Signup
                  </button>
                )}
                {mode === 'signup' && (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => switchMode('login')}
                  >
                    Already have an account? Login
                  </button>
                )}
                {mode === 'forgot' && (
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => switchMode('login')}
                  >
                    Back to Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
