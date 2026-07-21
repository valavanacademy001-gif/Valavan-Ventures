import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, Calendar, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '../../context/ToastContext';

const STATUS_OPTIONS = [
  { value: 'early',          label: 'Early' },
  { value: 'on_time',        label: 'On Time' },
  { value: 'late',           label: 'Late' },
  { value: 'half_day',       label: 'Half Day' },
  { value: 'wfh',            label: 'Work From Home' },
  { value: 'absent',         label: 'Absent' },
  { value: 'on_leave',       label: 'On Leave' },
  { value: 'holiday',        label: 'Holiday' },
  { value: 'sunday_holiday', label: 'Weekly Off' },
];

const STATUS_COLORS = {
  early:          { color: '#2563EB', bg: '#EFF6FF' },
  on_time:        { color: '#059669', bg: '#ECFDF5' },
  late:           { color: '#D97706', bg: '#FFFBEB' },
  half_day:       { color: '#7C3AED', bg: '#F5F3FF' },
  wfh:            { color: '#0EA5E9', bg: '#F0F9FF' },
  absent:         { color: '#DC2626', bg: '#FEF2F2' },
  on_leave:       { color: '#EA580C', bg: '#FFF7ED' },
  holiday:        { color: '#64748B', bg: '#F1F5F9' },
  sunday_holiday: { color: '#64748B', bg: '#F1F5F9' },
};

const formatMins = (mins) => {
  if (!mins || mins <= 0) return '0h 0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

export default function AttendanceDetailsDrawer({ data, onClose, isAdmin }) {
  const { updateAttendance, addAttendance, calculateAttendanceMetrics } = useApp();
  const { showToast } = useToast();
  const { user, record } = data;

  const [formData, setFormData] = useState({
    checkIn:  record.checkIn  || '',
    checkOut: record.checkOut || '',
    status:   record.status   || 'absent',
    remarks:  record.remarks  || '',
  });

  // Live-calculated metrics based on current form values
  const liveMetrics = calculateAttendanceMetrics(formData.checkIn, formData.checkOut);

  useEffect(() => {
    setFormData({
      checkIn:  record.checkIn  || '',
      checkOut: record.checkOut || '',
      status:   record.status   || 'absent',
      remarks:  record.remarks  || '',
    });
  }, [record]);

  // Auto-calculate status when time changes (unless manually overridden to absent/leave/holiday)
  const autoStatusFromTime = (checkIn, checkOut) => {
    const noAutoStatus = ['absent', 'on_leave', 'holiday', 'sunday_holiday', 'wfh'];
    if (!checkIn) return formData.status;
    const m = calculateAttendanceMetrics(checkIn, checkOut);
    if (noAutoStatus.includes(formData.status)) return formData.status;
    return m.status;
  };

  const handleCheckInChange = (val) => {
    const metrics = calculateAttendanceMetrics(val, formData.checkOut);
    setFormData(prev => ({
      ...prev,
      checkIn: val,
      status: (val || formData.checkOut) ? metrics.status : 'absent',
    }));
  };

  const handleCheckOutChange = (val) => {
    const metrics = calculateAttendanceMetrics(formData.checkIn, val);
    setFormData(prev => ({
      ...prev,
      checkOut: val,
      status: (formData.checkIn || val) ? metrics.status : 'absent',
    }));
  };

  const handleSave = () => {
    // For absent/leave/holiday, don't override with time-based status
    const manualStatus = ['absent', 'on_leave', 'holiday', 'sunday_holiday', 'wfh', 'half_day'];
    const finalStatus = manualStatus.includes(formData.status) ? formData.status : liveMetrics.status;

    const updates = {
      checkIn:      formData.checkIn,
      checkOut:     formData.checkOut,
      status:       finalStatus,
      remarks:      formData.remarks,
      workingHours: +(liveMetrics.workedMins / 60).toFixed(2),
      workedMins:   liveMetrics.workedMins,
      lateMinutes:  liveMetrics.lateMins,
      overtimeMins: liveMetrics.overtimeMins,
      earlyMins:    liveMetrics.earlyMins,
      source:       'Manual Entry',
      updatedBy:    'Admin',
      updatedTime:  new Date().toISOString(),
    };

    if (record.id) {
      updateAttendance(record.id, updates);
      showToast('Attendance updated successfully!', 'success');
    } else {
      addAttendance({ userId: user.id, date: record.date, ...updates });
      showToast('Attendance recorded successfully!', 'success');
    }
    onClose();
  };

  const isToday = record.date === new Date().toISOString().split('T')[0];
  const statusCfg = STATUS_COLORS[formData.status] || STATUS_COLORS.absent;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, background: 'var(--bg-card)', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '-6px 0 28px rgba(0,0,0,0.12)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-hover)' }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {isAdmin ? 'Edit Attendance' : 'Attendance Details'}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              {format(parseISO(record.date), 'EEEE, MMMM do, yyyy')}{isToday ? ' (Today)' : ''}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Admin notice */}
        {isAdmin && (
          <div style={{ padding: '10px 24px', background: '#EFF6FF', borderBottom: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={14} color="#2563EB" />
            <span style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 500 }}>
              Biometric data — enter times from the punching machine export
            </span>
          </div>
        )}

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Employee */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, padding: '14px 16px', background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700 }}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.employeeId} · {user.department}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: statusCfg.color, background: statusCfg.bg, padding: '4px 10px', borderRadius: 99 }}>
                {STATUS_OPTIONS.find(o => o.value === formData.status)?.label || 'Absent'}
              </span>
            </div>
          </div>

          {/* Office timing info */}
          <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 20, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Office:</span> 10:00 AM – 06:00 PM
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 700, color: '#059669' }}>Grace:</span> Until 10:10 AM
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 700, color: '#D97706' }}>Late:</span> After 10:10 AM
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</label>
              {isAdmin ? (
                <select
                  className="input"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <div style={{ fontSize: 15, fontWeight: 700, color: statusCfg.color, background: statusCfg.bg, padding: '10px 14px', borderRadius: 8, display: 'inline-block' }}>
                  {STATUS_OPTIONS.find(o => o.value === formData.status)?.label || 'Absent'}
                </div>
              )}
            </div>

            {/* Times */}
            <div className="grid-responsive-2" style={{ gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Check In (Biometric)
                </label>
                {isAdmin ? (
                  <input type="time" className="input" value={formData.checkIn} onChange={e => handleCheckInChange(e.target.value)} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                    <Clock size={16} color="var(--text-muted)" />
                    {formData.checkIn || '—'}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Check Out (Biometric)
                </label>
                {isAdmin ? (
                  <input type="time" className="input" value={formData.checkOut} onChange={e => handleCheckOutChange(e.target.value)} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                    <Clock size={16} color="var(--text-muted)" />
                    {formData.checkOut || '—'}
                  </div>
                )}
              </div>
            </div>

            {/* Live calculated metrics */}
            <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '16px 18px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
                Auto-Calculated Metrics
              </div>
              <div className="grid-responsive-2" style={{ gap: 14 }}>
                {[
                  { label: 'Worked Hours', value: formatMins(liveMetrics.workedMins), color: '#2563EB' },
                  { label: 'Late Minutes', value: liveMetrics.lateMins > 0 ? `${liveMetrics.lateMins} min` : '—', color: liveMetrics.lateMins > 0 ? '#DC2626' : 'var(--text-muted)' },
                  { label: 'Overtime', value: liveMetrics.overtimeMins > 0 ? formatMins(liveMetrics.overtimeMins) : '—', color: '#059669' },
                  { label: 'Early Arrival', value: liveMetrics.earlyMins > 0 ? formatMins(liveMetrics.earlyMins) : '—', color: '#7C3AED' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Remarks
              </label>
              {isAdmin ? (
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Enter any remarks (optional)..."
                  value={formData.remarks}
                  onChange={e => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                />
              ) : (
                <div style={{ fontSize: 14, color: 'var(--text-primary)', background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
                  {formData.remarks || 'No remarks.'}
                </div>
              )}
            </div>

            {/* Audit trail */}
            {(record.source || record.updatedBy) && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                {record.source && <div>Source: <b>{record.source}</b></div>}
                {record.updatedBy && <div>Last updated by: <b>{record.updatedBy}</b>{record.updatedTime ? ` at ${format(parseISO(record.updatedTime), 'MMM d, HH:mm')}` : ''}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {isAdmin ? (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-hover)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={15} /> Save Changes
            </button>
          </div>
        ) : (
          <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-hover)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <CheckCircle2 size={13} color="#059669" />
              Attendance is recorded from the biometric machine. Contact HR for any discrepancies.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
