import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES, mockUsers } from '../../data/mockData';
import { format } from 'date-fns';
import { Download, DollarSign, TrendingUp, FileText, Eye, X } from 'lucide-react';

function PayslipModal({ payslip, onClose }) {
  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal modal-md animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Payslip — {payslip.month}</div>
            <div className="modal-subtitle">Valavan Ventures Pvt. Ltd.</div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', borderRadius: 12, padding: '20px 24px', color: 'white', marginBottom: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Salary Slip</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{payslip.month}</div>
          </div>

          {/* Earnings & Deductions */}
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={14} color="var(--success)" /> Earnings
              </div>
              {[
                { label: 'Basic Salary', value: payslip.basicSalary },
                { label: 'HRA', value: payslip.hra },
                { label: 'Allowances', value: payslip.allowances },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, fontWeight: 700 }}>
                <span>Gross Salary</span>
                <span style={{ color: 'var(--success)' }}>₹{(payslip.basicSalary + payslip.hra + payslip.allowances).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={14} color="var(--danger)" style={{ transform: 'rotate(180deg)' }} /> Deductions
              </div>
              {[
                { label: 'PF', value: Math.round(payslip.deductions * 0.6) },
                { label: 'Professional Tax', value: Math.round(payslip.deductions * 0.2) },
                { label: 'TDS', value: Math.round(payslip.deductions * 0.2) },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--danger)' }}>-₹{item.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, fontWeight: 700 }}>
                <span>Total Deductions</span>
                <span style={{ color: 'var(--danger)' }}>₹{payslip.deductions.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Net Salary */}
          <div style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-mid)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Net Salary</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)', letterSpacing: -1 }}>₹{payslip.netSalary.toLocaleString('en-IN')}</div>
            </div>
            <span className="badge badge-success" style={{ fontSize: 12 }}>PAID</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => alert('PDF download would be triggered in production.')}>
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Payslips() {
  const { payslips } = useApp();
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState(null);

  const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR].includes(currentUser?.role);
  const myPayslips = isAdmin ? payslips : payslips.filter(p => p.userId === currentUser?.id);

  const totalEarned = myPayslips.reduce((s, p) => s + p.netSalary, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Payslips</h1>
          <p>View and download your salary slips</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid stat-grid-3 mb-6">
        <div className="stat-card" style={{ '--stat-color': 'var(--primary)' }}>
          <div className="stat-icon" style={{ background: 'var(--primary-light)' }}><DollarSign size={20} color="var(--primary)" /></div>
          <div className="stat-body">
            <div className="stat-label">Total Paid (YTD)</div>
            <div className="stat-value" style={{ fontSize: 22 }}>₹{totalEarned.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#059669' }}>
          <div className="stat-icon" style={{ background: '#ECFDF5' }}><FileText size={20} color="#059669" /></div>
          <div className="stat-body">
            <div className="stat-label">Payslips Available</div>
            <div className="stat-value">{myPayslips.length}</div>
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-color': '#7C3AED' }}>
          <div className="stat-icon" style={{ background: '#F5F3FF' }}><TrendingUp size={20} color="#7C3AED" /></div>
          <div className="stat-body">
            <div className="stat-label">Latest Payslip</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{myPayslips[0]?.month || '—'}</div>
          </div>
        </div>
      </div>

      {/* Payslip cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {myPayslips.map(ps => {
          const user = mockUsers.find(u => u.id === ps.userId);
          return (
            <div key={ps.id} className="card" style={{ cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ height: 4, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{ps.month}</div>
                    {isAdmin && user && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{user.name}</div>}
                  </div>
                  <span className="badge badge-success">Paid</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)', letterSpacing: -1, marginBottom: 12 }}>
                  ₹{ps.netSalary.toLocaleString('en-IN')}
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>₹{(ps.basicSalary + ps.hra + ps.allowances).toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deductions</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>-₹{ps.deductions.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => setSelected(ps)}>
                    <Eye size={13} /> View
                  </button>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => alert('PDF download in production')}>
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {myPayslips.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><DollarSign size={32} color="var(--text-muted)" /></div>
          <h3>No payslips yet</h3>
          <p>Your payslips will appear here once generated.</p>
        </div>
      )}

      {selected && <PayslipModal payslip={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
