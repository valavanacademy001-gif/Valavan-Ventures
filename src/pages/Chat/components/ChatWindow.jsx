import { useState, useRef, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { MoreHorizontal, Smile, Reply, Trash2, Edit2, FileText, Download } from 'lucide-react';
import { mockUsers } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626'];
const getColor = (name) => COLORS[name?.charCodeAt(0) % COLORS.length] || COLORS[0];
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

export default function ChatWindow({ chat, onDeleteMessage, onAddReaction }) {
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [chat?.messages]);

  if (!chat) return null;

  // Group messages by date
  const groupedMessages = [];
  let currentGroup = null;

  chat.messages.forEach(msg => {
    const msgDate = new Date(msg.timestamp);
    if (!currentGroup || !isSameDay(currentGroup.date, msgDate)) {
      currentGroup = { date: msgDate, messages: [] };
      groupedMessages.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px 32px', background: 'var(--bg-secondary)' }}>
      <div style={{ flex: 1 }}>
        {groupedMessages.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
              <div style={{ padding: '0 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                {format(group.date, 'MMMM d, yyyy')}
              </div>
              <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {group.messages.map((msg, mIdx) => {
                const isOwn = msg.senderId === currentUser?.id;
                const sender = mockUsers.find(u => u.id === msg.senderId);
                const showAvatar = mIdx === 0 || group.messages[mIdx - 1].senderId !== msg.senderId;

                return (
                  <div 
                    key={msg.id} 
                    style={{ display: 'flex', gap: 12, justifyContent: isOwn ? 'flex-end' : 'flex-start', position: 'relative' }}
                    onMouseEnter={() => setHoveredMsg(msg.id)}
                    onMouseLeave={() => setHoveredMsg(null)}
                  >
                    {!isOwn && (
                      <div style={{ width: 36, flexShrink: 0 }}>
                        {showAvatar && (
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: getColor(sender?.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13 }}>
                            {getInitials(sender?.name)}
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                      {!isOwn && showAvatar && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{sender?.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(new Date(msg.timestamp), 'h:mm a')}</span>
                        </div>
                      )}
                      {isOwn && showAvatar && (
                        <div style={{ marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(new Date(msg.timestamp), 'h:mm a')}</span>
                        </div>
                      )}

                      <div style={{ 
                        background: isOwn ? 'var(--primary)' : 'var(--bg-card)', 
                        color: isOwn ? 'white' : 'var(--text-primary)',
                        padding: '10px 16px', 
                        borderRadius: 16,
                        borderTopLeftRadius: !isOwn && showAvatar ? 4 : 16,
                        borderTopRightRadius: isOwn && showAvatar ? 4 : 16,
                        border: isOwn ? 'none' : '1px solid var(--border)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        position: 'relative'
                      }}>
                        {msg.text && (
                          <div style={{ fontSize: 14, lineHeight: 1.5, opacity: msg.deleted ? 0.6 : 1, fontStyle: msg.deleted ? 'italic' : 'normal' }}>
                            {msg.text}
                          </div>
                        )}
                        
                        {msg.attachments?.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: msg.text ? 12 : 0 }}>
                            {msg.attachments.map((file, fIdx) => (
                              <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: isOwn ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)', borderRadius: 8, border: isOwn ? 'none' : '1px solid var(--border)' }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: isOwn ? 'rgba(255,255,255,0.2)' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <FileText size={16} color={isOwn ? 'white' : 'var(--text-muted)'} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
                                  <div style={{ fontSize: 11, color: isOwn ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{file.size}</div>
                                </div>
                                <button style={{ background: 'transparent', border: 'none', color: isOwn ? 'white' : 'var(--text-muted)', cursor: 'pointer' }}>
                                  <Download size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reactions */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <div key={emoji} onClick={() => onAddReaction(chat.id, msg.id, emoji, currentUser.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: users.includes(currentUser.id) ? '#EFF6FF' : 'var(--bg-card)', border: `1px solid ${users.includes(currentUser.id) ? '#BFDBFE' : 'var(--border)'}`, padding: '2px 6px', borderRadius: 12, fontSize: 12, cursor: 'pointer', color: 'var(--text-primary)' }}>
                              <span>{emoji}</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{users.length}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Menu on Hover */}
                    {hoveredMsg === msg.id && !msg.deleted && (
                      <div style={{ display: 'flex', gap: 4, position: 'absolute', top: -16, [isOwn ? 'right' : 'left']: '50%', background: 'var(--bg-card)', padding: 4, borderRadius: 8, border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 10 }}>
                        <button className="btn-icon-small" onClick={() => onAddReaction(chat.id, msg.id, '👍', currentUser.id)}><Smile size={14} /></button>
                        <button className="btn-icon-small"><Reply size={14} /></button>
                        {isOwn && <button className="btn-icon-small"><Edit2 size={14} /></button>}
                        {isOwn && <button className="btn-icon-small" onClick={() => onDeleteMessage(chat.id, msg.id)} style={{ color: '#EF4444' }}><Trash2 size={14} /></button>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <style>{`
        .btn-icon-small {
          background: transparent;
          border: none;
          color: var(--text-muted);
          width: 28px;
          height: 28px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-icon-small:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
