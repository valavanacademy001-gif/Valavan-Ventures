import { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Image as ImageIcon, X } from 'lucide-react';

export default function ChatInput({ onSendMessage }) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && attachments.length === 0) return;
    
    onSendMessage(text.trim(), attachments);
    setText('');
    setAttachments([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newAttachments = files.map(f => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + 'MB',
      type: f.type,
      raw: f
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ padding: '16px 24px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
      {attachments.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          {attachments.map((att, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--bg-hover)', borderRadius: 8, fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{att.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>({att.size})</span>
              <button type="button" onClick={() => removeAttachment(idx)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'flex-end', gap: 12, background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 12, border: '1px solid var(--border)' }}>
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        
        <div style={{ display: 'flex', gap: 4, paddingBottom: 4 }}>
          <button type="button" className="btn-icon" onClick={() => fileInputRef.current?.click()}>
            <Paperclip size={18} />
          </button>
          <button type="button" className="btn-icon">
            <ImageIcon size={18} />
          </button>
          <button type="button" className="btn-icon">
            <Smile size={18} />
          </button>
        </div>
        
        <textarea
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            resize: 'none', 
            padding: '8px 4px',
            fontSize: 14,
            outline: 'none',
            minHeight: 24,
            maxHeight: 120,
            fontFamily: 'inherit',
            lineHeight: 1.5,
            color: 'var(--text-primary)'
          }}
          placeholder="Write a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          rows={1}
        />
        
        <button 
          type="submit" 
          style={{ 
            background: text.trim() || attachments.length > 0 ? 'var(--primary)' : 'var(--bg-hover)', 
            color: 'white', 
            border: 'none', 
            width: 36, 
            height: 36, 
            borderRadius: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: text.trim() || attachments.length > 0 ? 'pointer' : 'default',
            transition: 'background 0.2s',
            marginBottom: 2
          }}
          disabled={!text.trim() && attachments.length === 0}
        >
          <Send size={16} style={{ marginLeft: 2 }} />
        </button>
      </form>

      <style>{`
        .btn-icon {
          background: transparent;
          border: none;
          color: var(--text-muted);
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
