import { FileText, Download, Calendar, Users, Clock, AlertTriangle } from 'lucide-react';

const REPORTS = [
  { id: 'daily', title: 'Daily Attendance', description: 'Daily check-in/out logs and status for all employees.', icon: Calendar, color: '#2563EB', bg: '#EFF6FF' },
  { id: 'weekly', title: 'Weekly Summary', description: 'Aggregated attendance data and working hours for the week.', icon: Calendar, color: '#059669', bg: '#ECFDF5' },
  { id: 'monthly', title: 'Monthly Register', description: 'Complete monthly attendance register with leave balances.', icon: FileText, color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'employee', title: 'Employee Report', description: 'Detailed attendance history for a specific employee.', icon: Users, color: '#0891B2', bg: '#ECFEFF' },
  { id: 'late', title: 'Late Arrival Report', description: 'List of employees who arrived late during the selected period.', icon: Clock, color: '#D97706', bg: '#FFFBEB' },
  { id: 'absent', title: 'Absenteeism Report', description: 'List of absent employees and unauthorized leaves.', icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2' },
];

export default function AttendanceReports() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {REPORTS.map(report => (
          <div key={report.id} className="card table-row-hover" style={{ padding: 24, cursor: 'pointer', transition: 'all 0.2s ease' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: report.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <report.icon size={24} color={report.color} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{report.title}</h3>
                <p style={{ margin: '0 0 20px 0', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{report.description}</p>
                
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: 13 }} onClick={(e) => { e.stopPropagation(); alert('Downloading PDF...'); }}>
                    <Download size={14} /> PDF
                  </button>
                  <button className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: 13 }} onClick={(e) => { e.stopPropagation(); alert('Downloading Excel...'); }}>
                    <Download size={14} /> Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
