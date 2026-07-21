import { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Building2, Palette, Bell, Users, Calendar, Sun, Moon, Check, Plus, Trash2, Clock } from 'lucide-react';
import { DEPARTMENTS, DESIGNATIONS, HOLIDAYS } from '../../data/mockData';

const TABS = ['Company', 'Appearance', 'Attendance', 'Holidays', 'Biometrics', 'Departments', 'Designations', 'Permissions'];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Company');
  const [companyName, setCompanyName] = useState('Valavan Ventures Pvt. Ltd.');
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [saved, setSaved] = useState(false);
  const [depts, setDepts] = useState([...DEPARTMENTS]);
  const [newDept, setNewDept] = useState('');
  const [desigs, setDesigs] = useState([...DESIGNATIONS]);
  const [newDesig, setNewDesig] = useState('');

  const [holidays, setHolidays] = useState([...HOLIDAYS]);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'national', recurring: false });

  // Logo state — persisted in localStorage
  const logoInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(() => localStorage.getItem('company_logo') || null);
  const [logoError, setLogoError] = useState('');
  const [logoSaved, setLogoSaved] = useState(false);

  const ALLOWED_TYPES = ['image/png', 'image/svg+xml', 'image/jpg', 'image/jpeg'];
  const MAX_SIZE_MB = 5;

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    setLogoError('');
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLogoError('Invalid file type. Please upload PNG, SVG, JPG or JPEG.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setLogoError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleLogoSave = () => {
    if (logoPreview) {
      localStorage.setItem('company_logo', logoPreview);
      setLogoSaved(true);
      setTimeout(() => setLogoSaved(false), 2500);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    localStorage.removeItem('company_logo');
  };

  const handleSave = () => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Manage company configuration and preferences</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Sidebar tabs */}
        <div className="card" style={{ padding: '12px', height: 'fit-content' }}>
          {TABS.map(tab => (
            <div
              key={tab}
              className={`sidebar-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Company' && <Building2 size={16} />}
              {tab === 'Appearance' && <Palette size={16} />}
              {tab === 'Attendance' && <Clock size={16} />}
              {tab === 'Biometrics' && <Check size={16} />}
              {tab === 'Departments' && <Users size={16} />}
              {tab === 'Designations' && <Users size={16} />}
              {tab === 'Holidays' && <Calendar size={16} />}
              {tab === 'Permissions' && <Bell size={16} />}
              {tab}
            </div>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Company Tab */}
          {activeTab === 'Company' && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Company Information</div>
                  <div className="card-subtitle">Basic company details and branding</div>
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className="input input-lg" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Logo</label>
                  {/* Hidden file input */}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".png,.svg,.jpg,.jpeg,image/png,image/svg+xml,image/jpeg"
                    style={{ display: 'none' }}
                    onChange={handleLogoFileChange}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Logo preview box */}
                    <div style={{ width: 72, height: 72, background: logoPreview ? 'transparent' : primaryColor, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                      {logoPreview ? (
                        <img src={logoPreview} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <Building2 size={28} color="white" />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => logoInputRef.current?.click()}
                        >
                          {logoPreview ? 'Change Logo' : 'Upload Logo'}
                        </button>
                        {logoPreview && (
                          <>
                            <button type="button" className="btn btn-primary btn-sm" onClick={handleLogoSave}>
                              {logoSaved ? <><Check size={13} /> Saved!</> : 'Save Logo'}
                            </button>
                            <button type="button" className="btn btn-sm" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: 'none' }} onClick={handleLogoRemove}>
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                      {logoError ? (
                        <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 500 }}>{logoError}</div>
                      ) : (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, SVG, JPG or JPEG · Max 5MB</div>
                      )}
                      {logoSaved && (
                        <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>✓ Logo saved and will persist after refresh</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Color</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: 48, height: 40, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                    <input className="input" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: 120, fontFamily: 'monospace' }} />
                    {['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0EA5E9'].map(c => (
                      <div key={c} onClick={() => setPrimaryColor(c)} style={{ width: 28, height: 28, background: c, borderRadius: '50%', cursor: 'pointer', border: primaryColor === c ? '3px solid var(--text-primary)' : '3px solid transparent', transition: 'border 0.2s' }} />
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <button className="btn btn-primary" onClick={handleSave}>
                    {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'Appearance' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Appearance</div>
                <div className="card-subtitle">Customize the look and feel</div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-hover)', borderRadius: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Color Theme</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Currently: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}</div>
                  </div>
                  <button className="btn btn-secondary" onClick={toggleTheme} style={{ gap: 8 }}>
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    Switch to {theme === 'light' ? 'Dark' : 'Light'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: 'Light Mode', desc: 'Clean white background', img: '☀️' },
                    { label: 'Dark Mode', desc: 'Easy on the eyes', img: '🌙' },
                  ].map(opt => (
                    <div key={opt.label} onClick={theme === 'light' && opt.label === 'Light Mode' ? undefined : toggleTheme}
                      style={{ padding: '20px', background: 'var(--bg-hover)', borderRadius: 12, cursor: 'pointer', border: `2px solid ${(theme === 'light' && opt.label === 'Light Mode') || (theme === 'dark' && opt.label === 'Dark Mode') ? 'var(--primary)' : 'transparent'}` }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{opt.img}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Departments Tab */}
          {activeTab === 'Departments' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Departments</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <input className="input" placeholder="Add new department..." value={newDept} onChange={e => setNewDept(e.target.value)} />
                  <button className="btn btn-primary" onClick={() => { if (newDept) { setDepts(d => [...d, newDept]); setNewDept(''); } }}>
                    <Plus size={15} /> Add
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                  {depts.map(d => (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{d}</span>
                      <button onClick={() => setDepts(prev => prev.filter(x => x !== d))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Designations Tab */}
          {activeTab === 'Designations' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Designations</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <input className="input" placeholder="Add new designation..." value={newDesig} onChange={e => setNewDesig(e.target.value)} />
                  <button className="btn btn-primary" onClick={() => { if (newDesig) { setDesigs(d => [...d, newDesig]); setNewDesig(''); } }}>
                    <Plus size={15} /> Add
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {desigs.map(d => (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{d}</span>
                      <button onClick={() => setDesigs(prev => prev.filter(x => x !== d))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Holidays Tab */}
          {activeTab === 'Holidays' && (
            <div className="card animate-fadeIn">
              <div className="card-header">
                <div>
                  <div className="card-title">Holiday Calendar</div>
                  <div className="card-subtitle">Manage company holidays and observances</div>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <input className="input" placeholder="Holiday Name" value={newHoliday.name} onChange={e => setNewHoliday({...newHoliday, name: e.target.value})} style={{ flex: 1 }} />
                  <input type="date" className="input" value={newHoliday.date} onChange={e => setNewHoliday({...newHoliday, date: e.target.value})} />
                  <select className="input" value={newHoliday.type} onChange={e => setNewHoliday({...newHoliday, type: e.target.value})}>
                    <option value="national">National</option>
                    <option value="company">Company</option>
                    <option value="regional">Regional</option>
                  </select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <input type="checkbox" checked={newHoliday.recurring} onChange={e => setNewHoliday({...newHoliday, recurring: e.target.checked})} /> Recurring
                  </label>
                  <button className="btn btn-primary" onClick={() => {
                    if (newHoliday.name && newHoliday.date) {
                      setHolidays([...holidays, { ...newHoliday, id: Date.now().toString() }]);
                      setNewHoliday({ name: '', date: '', type: 'national', recurring: false });
                    }
                  }}>
                    <Plus size={16} /> Add Holiday
                  </button>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Holiday Name</th>
                        <th>Type</th>
                        <th>Recurring</th>
                        <th style={{ width: 80 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holidays.map((h, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{new Date(h.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                          <td>{h.name}</td>
                          <td><span className="badge" style={{ background: 'var(--bg-hover)' }}>{h.type}</span></td>
                          <td>{h.recurring ? 'Yes' : 'No'}</td>
                          <td>
                            <button className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => setHolidays(holidays.filter(x => x.id !== h.id))}><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Settings Tab */}
          {activeTab === 'Attendance' && (
            <div className="card animate-fadeIn">
              <div className="card-header">
                <div>
                  <div className="card-title">Attendance Policy</div>
                  <div className="card-subtitle">Configure working hours and attendance rules</div>
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Office Start Time</label>
                    <input type="time" className="input" defaultValue="10:00" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Office End Time</label>
                    <input type="time" className="input" defaultValue="18:00" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Grace Time (Minutes)</label>
                    <input type="number" className="input" defaultValue="15" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mark Half-Day If Working Hours {'<'} </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" className="input" defaultValue="5" style={{ width: '100%' }} />
                      <span>hrs</span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Working Days</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <button key={day} className={`btn ${i < 5 ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '8px 12px' }}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <button className="btn btn-primary"><Check size={14} /> Save Policies</button>
                </div>
              </div>
            </div>
          )}

          {/* Biometrics Tab */}
          {activeTab === 'Biometrics' && (
            <div className="card animate-fadeIn">
              <div className="card-header">
                <div>
                  <div className="card-title">Biometric Integration</div>
                  <div className="card-subtitle">Architecture prepared for future hardware syncing</div>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div className="card" style={{ padding: 16, border: '2px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: 0, fontWeight: 700 }}>ESSL Face Device</h4>
                      <span className="badge badge-success">Connected</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>IP: 192.168.1.100</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Port: 4370</div>
                  </div>
                  <div className="card" style={{ padding: 16, border: '2px dashed var(--border)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                      <Plus size={24} style={{ marginBottom: 8 }} />
                      <span style={{ fontWeight: 600 }}>Add New Device</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Data Sync Frequency</label>
                  <select className="input">
                    <option>Real-time (Push API)</option>
                    <option>Every 5 Minutes</option>
                    <option>Every 1 Hour</option>
                    <option>End of Day</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cloud Sync Endpoint (Webhook)</label>
                  <input className="input" defaultValue="https://api.valavan.ventures/webhooks/attendance" readOnly />
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  <button className="btn btn-primary"><Check size={14} /> Save Configuration</button>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'Permissions' && (
            <div className="card">
              <div className="card-header"><div className="card-title">Role Permissions</div></div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Permission</th>
                      <th>Super Admin</th>
                      <th>Admin</th>
                      <th>HR</th>
                      <th>Manager</th>
                      <th>Employee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'View All Dashboards', perms: [true, true, true, true, false] },
                      { label: 'Add Employee', perms: [true, true, true, false, false] },
                      { label: 'Assign Tasks', perms: [true, true, false, true, false] },
                      { label: 'Approve Tasks', perms: [true, true, false, true, false] },
                      { label: 'Submit for Review', perms: [true, true, true, true, true] },
                      { label: 'Approve Leaves', perms: [true, true, true, true, false] },
                      { label: 'Generate Payslip', perms: [true, true, true, false, false] },
                      { label: 'View All Payslips', perms: [true, true, true, false, false] },
                      { label: 'Edit Attendance', perms: [true, true, true, false, false] },
                      { label: 'Manage Settings', perms: [true, true, false, false, false] },
                    ].map(row => (
                      <tr key={row.label}>
                        <td style={{ fontWeight: 600 }}>{row.label}</td>
                        {row.perms.map((has, i) => (
                          <td key={i}>
                            <span style={{ color: has ? 'var(--success)' : 'var(--danger)', fontWeight: 700, fontSize: 16 }}>
                              {has ? '✓' : '✗'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
