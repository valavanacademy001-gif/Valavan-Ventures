import { useState } from 'react';
import { Search, X, Users, CheckSquare, FolderOpen, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const { employees, tasks, projects, chats } = useApp();
  const navigate = useNavigate();

  const q = query.toLowerCase().trim();

  const results = q ? [
    ...employees.filter(e => e.name.toLowerCase().includes(q) || e.designation?.toLowerCase().includes(q))
      .map(e => ({ type: 'employee', label: e.name, sub: e.designation, icon: Users, id: e.id, color: '#2563EB', path: '/employees' })),
    ...tasks.filter(t => t.title.toLowerCase().includes(q))
      .map(t => ({ type: 'task', label: t.title, sub: t.status, icon: CheckSquare, id: t.id, color: '#059669', path: '/tasks' })),
    ...projects.filter(p => p.name.toLowerCase().includes(q) || p.client?.toLowerCase().includes(q))
      .map(p => ({ type: 'project', label: p.name, sub: p.client, icon: FolderOpen, id: p.id, color: '#7C3AED', path: '/projects' })),
    ...chats.filter(c => c.name.toLowerCase().includes(q))
      .map(c => ({ type: 'chat', label: c.name, sub: 'Chat', icon: MessageSquare, id: c.id, color: '#D97706', path: '/chat' })),
  ].slice(0, 8) : [];

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  return (
    <div className="search-overlay animate-fadeIn" onClick={onClose}>
      <div className="search-modal animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="search-input-bar">
          <Search size={18} color="var(--text-muted)" />
          <input
            autoFocus
            placeholder="Search employees, tasks, projects, chats..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {results.length === 0 && query && (
          <div className="empty-state" style={{padding:'40px 24px'}}>
            <p>No results for "{query}"</p>
          </div>
        )}

        {results.length === 0 && !query && (
          <div style={{padding:'20px 24px'}}>
            <div style={{fontSize:12,fontWeight:600,color:'var(--text-muted)',marginBottom:12,textTransform:'uppercase',letterSpacing:'0.06em'}}>Quick Links</div>
            {[{label:'Employees',path:'/employees',icon:Users},{label:'Tasks',path:'/tasks',icon:CheckSquare},{label:'Projects',path:'/projects',icon:FolderOpen}].map(item=>(
              <div key={item.path} className="search-result-item" onClick={()=>{navigate(item.path);onClose();}}>
                <div style={{width:32,height:32,borderRadius:8,background:'var(--bg-hover)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <item.icon size={15} color="var(--text-secondary)" />
                </div>
                <span style={{fontSize:14,fontWeight:500,color:'var(--text-primary)'}}>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="search-results">
          {results.map(item => (
            <div key={`${item.type}-${item.id}`} className="search-result-item" onClick={() => handleSelect(item)}>
              <div style={{width:36,height:36,borderRadius:8,background:`${item.color}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <item.icon size={16} color={item.color} />
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13.5,fontWeight:600,color:'var(--text-primary)'}}>{item.label}</div>
                <div style={{fontSize:12,color:'var(--text-muted)',textTransform:'capitalize'}}>{item.sub?.replace(/_/g,' ')}</div>
              </div>
              <span className="badge badge-gray" style={{textTransform:'capitalize'}}>{item.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
