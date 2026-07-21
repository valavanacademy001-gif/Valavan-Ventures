import { useState } from 'react';
import { X, Loader2, ChevronRight, ChevronLeft, Check, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEPARTMENTS, DESIGNATIONS, ROLES, EMPLOYEE_STATUS } from '../../data/mockData';

const STEPS = [
  'Basic Info',
  'Employment Details',
  'Role & Permissions',
  'Documents',
  'Review'
];

export default function AddEmployeeModal({ onClose }) {
  const { addEmployee, employees } = useApp();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    emergencyContact: '',
    bloodGroup: '',
    address: '',
    department: '', 
    designation: '', 
    role: ROLES.EMPLOYEE, 
    joinDate: new Date().toISOString().split('T')[0], 
    location: '', 
    employmentType: 'Full-time',
    reportingManager: '',
    status: EMPLOYEE_STATUS.ACTIVE,
    password: 'emp123',
    documents: []
  });

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({
        ...f,
        documents: [...f.documents, { name: file.name, type }]
      }));
    }
  };

  const removeDocument = (index) => {
    setForm(f => ({
      ...f,
      documents: f.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate API delay
    addEmployee(form);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal modal-lg animate-scaleIn" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 800, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '90vh' }}>
        
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Add New Employee</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Step {step + 1} of {STEPS.length}: {STEPS[step]}</div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Stepper Progress */}
        <div style={{ display: 'flex', padding: '20px 32px', background: 'var(--bg-hover)', gap: 8 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ height: 4, borderRadius: 2, background: i <= step ? 'var(--primary)' : 'var(--border)' }}></div>
              <div style={{ fontSize: 11, fontWeight: 600, color: i <= step ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</div>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          
          {step === 0 && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="input" placeholder="e.g. Valavan" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="input" type="email" placeholder="valavan@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="input" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Emergency Contact</label>
                  <input className="input" placeholder="+91 8765432109" value={form.emergencyContact} onChange={e => setForm(f => ({ ...f, emergencyContact: e.target.value }))} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select className="input select" value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))}>
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="input" placeholder="e.g. Chennai, TN" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Address</label>
                <textarea className="input" rows={3} placeholder="Enter full residential address..." value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}></textarea>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select className="input select" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} required>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Designation *</label>
                  <select className="input select" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} required>
                    <option value="">Select designation</option>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Employment Type *</label>
                  <select className="input select" value={form.employmentType} onChange={e => setForm(f => ({ ...f, employmentType: e.target.value }))}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select className="input select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Joining Date *</label>
                  <input className="input" type="date" value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Reporting Manager</label>
                  <select className="input select" value={form.reportingManager} onChange={e => setForm(f => ({ ...f, reportingManager: e.target.value }))}>
                    <option value="">None</option>
                    {employees.filter(e => e.role === ROLES.MANAGER || e.role === ROLES.ADMIN || e.role === ROLES.SUPER_ADMIN).map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.designation})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="form-group">
                <label className="form-label">System Role *</label>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { val: ROLES.EMPLOYEE, label: 'Employee', desc: 'Can view own profile, tasks, attendance.' },
                    { val: ROLES.MANAGER, label: 'Manager', desc: 'Can manage projects, approve tasks & leaves.' },
                    { val: ROLES.HR, label: 'HR', desc: 'Can manage all employees, leaves, attendance.' },
                    { val: ROLES.ADMIN, label: 'Admin', desc: 'Full access to operations and reports.' }
                  ].map(r => (
                    <div 
                      key={r.val} 
                      onClick={() => setForm(f => ({ ...f, role: r.val }))}
                      style={{ 
                        flex: '1 1 calc(50% - 6px)', 
                        border: `2px solid ${form.role === r.val ? 'var(--primary)' : 'var(--border)'}`, 
                        padding: 16, 
                        borderRadius: 'var(--radius)', 
                        cursor: 'pointer',
                        background: form.role === r.val ? 'var(--primary-light)' : 'var(--bg-card)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ fontWeight: 600, color: form.role === r.val ? 'var(--primary)' : 'var(--text-primary)' }}>{r.label}</div>
                        {form.role === r.val && <Check size={16} color="var(--primary)" />}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">Initial Password</label>
                <input className="input" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <span className="form-sublabel">The employee will be forced to change this upon first login.</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="card" style={{ borderStyle: 'dashed', background: 'var(--bg-hover)' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', textAlign: 'center' }}>
                  <UploadCloud size={40} color="var(--primary)" style={{ marginBottom: 12 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Upload Documents</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Attach ID Proof, Offer Letter, Resumes, etc.</p>
                  
                  <div style={{ display: 'flex', gap: 12 }}>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                      <span>Add Offer Letter</span>
                      <input type="file" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'Offer Letter')} />
                    </label>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                      <span>Add ID Proof</span>
                      <input type="file" style={{ display: 'none' }} onChange={e => handleFileUpload(e, 'ID Proof')} />
                    </label>
                  </div>
                </div>
              </div>

              {form.documents.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Attached Documents</div>
                  {form.documents.map((doc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FileText size={18} color="var(--primary)" />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{doc.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.type}</div>
                        </div>
                      </div>
                      <button className="icon-btn" onClick={() => removeDocument(i)}><X size={14} color="var(--danger)" /></button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {step === 4 && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Review Employee Details</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Please verify the information before finalizing.</p>
              </div>

              <div className="card">
                <div className="card-body grid-responsive-2" style={{ gap: '20px 32px' }}>
                  <ReviewItem label="Full Name" value={form.name} />
                  <ReviewItem label="Email" value={form.email} />
                  <ReviewItem label="Phone" value={form.phone} />
                  <ReviewItem label="Department" value={form.department} />
                  <ReviewItem label="Designation" value={form.designation} />
                  <ReviewItem label="Role" value={form.role} />
                  <ReviewItem label="Employment Type" value={form.employmentType} />
                  <ReviewItem label="Joining Date" value={form.joinDate} />
                  <ReviewItem label="Location" value={form.location} />
                  <ReviewItem label="Documents Attached" value={form.documents.length} />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
          <button className="btn btn-secondary" onClick={step === 0 ? onClose : prevStep}>
            {step === 0 ? 'Cancel' : <><ChevronLeft size={16} /> Back</>}
          </button>
          
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={nextStep} disabled={step === 0 && (!form.name || !form.email)}>
              Next Step <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Adding Employee...' : 'Confirm & Add Employee'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{value || '—'}</div>
    </div>
  );
}
