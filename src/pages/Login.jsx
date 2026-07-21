import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Eye, EyeOff, Loader2, ShieldAlert, X } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Employee Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin Login Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminShowPw, setAdminShowPw] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      login(username, password, true, false); // Employee login (remember=true, adminOnly=false)
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminLoading(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      login(adminUsername, adminPassword, true, true); // Admin login (remember=true, adminOnly=true)
      navigate('/dashboard');
    } catch (err) {
      setAdminError(err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F5FF', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Main Login Card */}
      <div style={{ width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 16, boxShadow: '0 10px 25px rgba(37, 99, 235, 0.1)', padding: 40, marginBottom: 24, zIndex: 1 }}>
        
        {/* Logo & Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <img src="/logo-icon.png" alt="Valavan Ventures" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1E3A8A', margin: '0 0 8px 0' }}>Welcome Back</h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>Sign in to continue</p>
        </div>

        <form onSubmit={handleEmployeeLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 15, outline: 'none', transition: 'border-color 0.2s', backgroundColor: 'white', color: '#0F172A' }}
              onFocus={(e) => e.target.style.borderColor = '#2563EB'}
              onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 15, outline: 'none', transition: 'border-color 0.2s', paddingRight: 48, backgroundColor: 'white', color: '#0F172A' }}
                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '14px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = '#1D4ED8'; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = '#2563EB'; }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Admin Access Card */}
      <div 
        onClick={() => setShowAdminModal(true)}
        style={{ width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 12, boxShadow: '0 4px 6px rgba(0,0,0,0.05)', padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', border: '1px solid #E2E8F0', transition: 'transform 0.2s, box-shadow 0.2s', zIndex: 1 }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 15px rgba(37, 99, 235, 0.1)'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
      >
        <div style={{ width: 40, height: 40, backgroundColor: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldAlert size={20} color="#2563EB" />
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1E293B', margin: '0 0 4px 0' }}>Administrator Access</h3>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Only Administrators can login here.</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 40, textAlign: 'center', color: '#64748B', fontSize: 13, fontWeight: 500, zIndex: 1 }}>
        <div>Version 1.0</div>
        <div style={{ marginTop: 4 }}>Valavan Ventures Pvt Ltd</div>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: 400, borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', animation: 'scaleIn 0.2s ease-out' }}>
            
            <div style={{ backgroundColor: '#1E3A8A', padding: '24px 24px', position: 'relative' }}>
              <button 
                onClick={() => setShowAdminModal(false)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#BFDBFE', cursor: 'pointer', padding: 4 }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = '#BFDBFE'}
              >
                <X size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ShieldAlert size={24} color="white" />
                <h2 style={{ margin: 0, color: 'white', fontSize: 18, fontWeight: 600 }}>Admin Login</h2>
              </div>
            </div>

            <div style={{ padding: 32 }}>
              <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Admin Username</label>
                  <input 
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 15, outline: 'none', backgroundColor: 'white', color: '#0F172A' }}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={adminShowPw ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 15, outline: 'none', paddingRight: 48, backgroundColor: 'white', color: '#0F172A' }}
                      onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                      onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowPw(!adminShowPw)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}
                    >
                      {adminShowPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: '1px solid #FECACA' }}>
                    {adminError}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={adminLoading}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#1E3A8A', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: adminLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}
                >
                  {adminLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                  {adminLoading ? 'Authenticating...' : 'Sign In as Admin'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
