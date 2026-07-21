import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AttendanceImport() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mock parsed data
  const mockPreview = [
    { row: 1, empId: 'EMP-1002', date: '2024-07-18', in: '10:00', out: '18:00', status: 'Valid' },
    { row: 2, empId: 'EMP-1005', date: '2024-07-18', in: '10:15', out: '18:00', status: 'Valid' },
    { row: 3, empId: 'EMP-9999', date: '2024-07-18', in: '10:00', out: '18:00', status: 'Invalid ID' },
    { row: 4, empId: 'EMP-1006', date: '2024-07-18', in: '', out: '', status: 'Missing Time' },
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setTimeout(() => setStep(2), 500);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .xlsx, .xls';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        setTimeout(() => setStep(2), 500);
      }
    };
    input.click();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: step >= 1 ? 'var(--primary)' : 'var(--text-muted)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= 1 ? 'var(--primary)' : 'var(--bg-hover)', color: step >= 1 ? 'white' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>1</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Upload File</span>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: step >= 2 ? 'var(--primary)' : 'var(--text-muted)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= 2 ? 'var(--primary)' : 'var(--bg-hover)', color: step >= 2 ? 'white' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>2</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Preview & Validate</span>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: step >= 3 ? 'var(--primary)' : 'var(--text-muted)' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= 3 ? 'var(--primary)' : 'var(--bg-hover)', color: step >= 3 ? 'white' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>3</div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Import Success</span>
        </div>
      </div>

      {step === 1 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Import Attendance Data</div>
          </div>
          <div className="card-body">
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={handleUploadClick}
              style={{ 
                border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border)'}`, 
                borderRadius: 16, 
                padding: 60, 
                textAlign: 'center', 
                background: isDragging ? 'var(--primary-light)' : 'var(--bg-hover)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <FileSpreadsheet size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>Click or drag file to this area to upload</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.</p>
              <div style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 16, justifyContent: 'center' }}>
                <span>Supported: .csv, .xlsx</span>
                <span>Max size: 10MB</span>
              </div>
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <a href="#" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Download Sample CSV Template</a>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card animate-fadeIn">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card-title">Data Preview & Validation</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>File: {file?.name || 'attendance_log.csv'}</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Confirm & Import</button>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#ECFDF5', color: '#059669', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
                <CheckCircle2 size={16} /> 2 Valid Rows
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#FEF2F2', color: '#DC2626', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
                <AlertCircle size={16} /> 2 Invalid Rows
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Employee ID</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Validation</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPreview.map(row => (
                    <tr key={row.row} style={{ background: row.status !== 'Valid' ? '#FEF2F2' : 'transparent' }}>
                      <td>{row.row}</td>
                      <td>{row.empId}</td>
                      <td>{row.date}</td>
                      <td>{row.in || '—'}</td>
                      <td>{row.out || '—'}</td>
                      <td>
                        {row.status === 'Valid' ? (
                          <span style={{ color: '#059669', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle2 size={14} /> Valid</span>
                        ) : (
                          <span style={{ color: '#DC2626', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={14} /> {row.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>
              Note: Invalid rows will be skipped during import. Please correct them in the source file and re-upload if needed.
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card animate-fadeIn" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Import Successful!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: '0 0 32px 0' }}>
            Successfully imported 2 attendance records. 2 invalid records were skipped.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => { setStep(1); setFile(null); }}>Import Another File</button>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Go to Overview</button>
          </div>
        </div>
      )}

    </div>
  );
}
