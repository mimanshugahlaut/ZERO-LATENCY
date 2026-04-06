import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export function AuthModal({ isOpen, onClose, onLogin }) {
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier) {
      setError(`Please enter your ${method}`);
      return;
    }
    
    // Basic validation
    if (method === 'email' && !identifier.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (method === 'phone' && identifier.length < 7) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(identifier, method);
      onClose(); // Close modal on success
      // Reset state for next open
      setTimeout(() => {
        setStep(1);
        setIdentifier('');
        setOtp('');
      }, 300);
    } catch {
      setError('Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={step === 1 ? 'Login Securely' : 'Verify Identity'}
      onClose={onClose}
    >
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
          {step === 1 
            ? 'Register or log in to cast your secure vote.'
            : `We've sent a code to ${identifier}`}
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', background: 'rgba(235, 87, 87, 0.1)', border: '1px solid rgba(235, 87, 87, 0.2)', color: 'var(--error)', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', padding: '4px', background: 'var(--surface-high)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => setMethod('email')}
              style={{
                flex: 1, padding: 'var(--space-2)', fontSize: '0.85rem', fontWeight: '500', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                background: method === 'email' ? 'var(--primary-container)' : 'transparent',
                color: method === 'email' ? '#fff' : 'var(--on-surface-variant)',
                transition: 'all 0.2s'
              }}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              style={{
                flex: 1, padding: 'var(--space-2)', fontSize: '0.85rem', fontWeight: '500', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                background: method === 'phone' ? 'var(--primary-container)' : 'transparent',
                color: method === 'phone' ? '#fff' : 'var(--on-surface-variant)',
                transition: 'all 0.2s'
              }}
            >
              Phone No.
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--on-surface-variant)', marginBottom: 'var(--space-2)' }}>
              {method === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={method === 'email' ? 'email' : 'tel'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={method === 'email' ? 'you@example.com' : '+1 (555) 000-0000'}
              className="input-field"
              style={{ width: '100%' }}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            loading={isLoading}
            style={{ marginTop: 'var(--space-4)' }}
          >
            Send Verification Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--on-surface-variant)', marginBottom: 'var(--space-2)', textAlign: 'center' }}>
              6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="input-field"
              style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', fontFamily: 'var(--font-mono)' }}
            />
            <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--on-surface-variant)', marginTop: 'var(--space-3)' }}>
              (Hint: Use any 6 digits to log in)
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              loading={isLoading}
            >
              Verify & Login
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', fontSize: '0.85rem', cursor: 'pointer', padding: 'var(--space-2)' }}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
