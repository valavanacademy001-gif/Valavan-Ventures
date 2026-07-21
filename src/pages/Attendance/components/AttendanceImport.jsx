import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function AttendanceImport({ onClose }) {
  const { importAttendance, employees } = useApp();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      parseFile(selected);
    }
  };

  const parseFile = (file) => {
    // In a real app, we'd use PapaParse or similar.
    // Here we'll mock reading the file and generate preview data.
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      
      const dummyParsed = [
        { row: 1, empId: 'EMP-1002', date: '2024-07-18', in: '10:00', out: '18:00', status: 'Valid' },
        { row: 2, empId: 'EMP-1003', date: '2024-07-18', in: '10:45', out: '18:15', status: 'Valid' },
        { row: 3, empId: 'EMP-9999', date: '2024-07-18', in: '10:00', out: '18:00', status: 'Invalid ID' },
      ];
      
      const records = [];
      let err = null;
      
      // Expected CSV: EmployeeID, Date(YYYY-MM-DD), IN, OUT
      // Example: EMP-1002, 2024-07-18, 10:00, 18:04
      
      for (let i = 1; i < Math.min(lines.length, 100); i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const cols = line.split(',');
        if (cols.length < 4) continue;
        
        const empId = cols[0].trim();
        const dateStr = cols[1].trim();
        const inTime = cols[2].trim();
        const outTime = cols[3].trim();
        
        const user = employees.find(emp => emp.employeeId === empId);
        if (!user) continue;

        let inH = null, inM = null, outH = null, outM = null;
        let workingHours = 0;
        let lateMinutes = 0;
        let status = 'present';

        if (inTime && inTime.includes(':')) {
            const inParts = inTime.split(':');
            inH = parseInt(inParts[0], 10);
            inM = parseInt(inParts[1], 10);
        }
        if (outTime && outTime.includes(':')) {
            const outParts = outTime.split(':');
            outH = parseInt(outParts[0], 10);
            outM = parseInt(outParts[1], 10);
        }

        if (inH !== null && outH !== null) {
            const totalM = ((outH * 60) + outM) - ((inH * 60) + inM);
            workingHours = +(totalM / 60).toFixed(2);
            if ((inH * 60 + inM) > (10 * 60 + 10)) {
                status = 'late';
                lateMinutes = (inH * 60 + inM) - (10 * 60 + 10);
            }
        } else {
            status = 'absent';
        }

        records.push({
          userId: user.id,
          employeeId: user.employeeId,
          name: user.name,
          date: dateStr,
          status,
          checkIn: inTime,
          checkOut: outTime,
          workingHours,
          lateMinutes,
          remarks: 'Biometric Import',
        });
      }
      
      if (records.length === 0) {
        err = "No valid records found in the CSV. Please check the format.";
      }
      
      setPreview(records);
      setError(err);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Mock network delay
    
    // Filter out UI properties not needed in DB
    const finalData = preview.map(p => ({
        userId: p.userId,
        date: p.date,
        status: p.status,
        checkIn: p.checkIn,
        checkOut: p.checkOut,
        workingHours: p.workingHours,
        lateMinutes: p.lateMinutes,
        remarks: p.remarks
    }));

    importAttendance(finalData);
    
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
        onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal modal-lg animate-scaleIn" onClick={e => e.stopPropagation()} style={{ width: '800px', maxWidth: '90vw' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Import Biometric Attendance</div>
            <div className="modal-subtitle">Upload CSV/Excel exported from biometric machine</div>
          </div>
          <button className="icon-btn" onClick={onClose}><XCircle size={20} /></button>
        </div>
        
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {success ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                    <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: 20, marginBottom: 8 }}>Import Successful!</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Attendance records have been updated.</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 1, border: '2px dashed var(--border)', borderRadius: 12, padding: 32, textAlign: 'center', background: 'var(--bg-hover)', cursor: 'pointer', position: 'relative' }}>
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleFileChange} 
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                            />
                            <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
                            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                                Click to upload CSV file
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                Format: EmployeeID, Date (YYYY-MM-DD), IN (HH:MM), OUT (HH:MM)
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '12px 16px', background: '#FEF2F2', color: '#DC2626', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    {file && preview.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>Preview ({preview.length} records)</div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <FileText size={14} /> {file.name}
                                </div>
                            </div>
                            <div className="table-responsive" style={{ maxHeight: 250, overflowY: 'auto' }}>
                                <table className="table">
                                    <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Date</th>
                                            <th>IN</th>
                                            <th>OUT</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {preview.map((p, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.employeeId}</div>
                                                </td>
                                                <td>{p.date}</td>
                                                <td>{p.checkIn || '-'}</td>
                                                <td>{p.checkOut || '-'}</td>
                                                <td>
                                                    <span className={`badge badge-${(p.status === 'present' || p.status === 'early' || p.status === 'on_time') ? 'success' : p.status === 'late' ? 'warning' : 'danger'}`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>

        {!success && (
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleImport} disabled={!file || preview.length === 0 || loading}>
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {loading ? 'Importing...' : 'Import Data'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
