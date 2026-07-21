import { Search, Filter, X } from 'lucide-react';
import { TASK_STATUS, PRIORITY } from '../../../data/mockData';

export default function TaskFilters({ searchQ, setSearchQ, filterStatus, setFilterStatus, filterPriority, setFilterPriority }) {
  
  const handleClear = () => {
    setSearchQ('');
    setFilterStatus('all');
    setFilterPriority('all');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px 24px', background: '#F8FAFC', borderRadius: 12, border: '1px solid var(--border-color)' }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          className="input" 
          placeholder="Search tasks..." 
          style={{ width: '100%', paddingLeft: 36, background: 'white' }}
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>Status</span>
        </div>
        <select className="input select" style={{ background: 'white', minWidth: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {Object.values(TASK_STATUS).map(status => (
            <option key={status} value={status}>{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>Priority</span>
        </div>
        <select className="input select" style={{ background: 'white', minWidth: 140 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value={PRIORITY.CRITICAL}>Critical</option>
          <option value={PRIORITY.HIGH}>High</option>
          <option value={PRIORITY.MEDIUM}>Medium</option>
          <option value={PRIORITY.LOW}>Low</option>
        </select>
      </div>

      {(searchQ || filterStatus !== 'all' || filterPriority !== 'all') && (
        <button className="btn btn-outline" style={{ border: 'none', color: 'var(--text-muted)' }} onClick={handleClear}>
          <X size={16} /> Clear
        </button>
      )}
    </div>
  );
}
