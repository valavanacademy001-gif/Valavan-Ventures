import { Search, Pin, Star, Hash, User } from 'lucide-react';
import { format } from 'date-fns';
import { mockUsers } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626'];
const getColor = (name) => COLORS[name?.charCodeAt(0) % COLORS.length] || COLORS[0];
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

export default function ChatSidebar({ chats, activeChatId, onSelectChat, search, onSearchChange }) {
  const { currentUser } = useAuth();

  const getChatDisplayName = (chat) => {
    if (chat.type === 'group') return chat.name;
    const other = chat.members.find(id => id !== currentUser?.id);
    const user = mockUsers.find(u => u.id === other);
    return user?.name || chat.name;
  };

  const getUnreadCount = (chat) => {
    return chat.messages.filter(m => !m.readBy?.includes(currentUser?.id) && m.senderId !== currentUser?.id).length;
  };

  const filteredChats = chats.filter(c => getChatDisplayName(c).toLowerCase().includes(search.toLowerCase()));

  const pinnedChats = filteredChats.filter(c => c.pinned);
  const favoriteChats = filteredChats.filter(c => c.favorites?.includes(currentUser?.id) && !c.pinned);
  const groupChats = filteredChats.filter(c => c.type === 'group' && !c.pinned && !c.favorites?.includes(currentUser?.id));
  const directChats = filteredChats.filter(c => c.type === 'direct' && !c.pinned && !c.favorites?.includes(currentUser?.id));

  const renderChatItem = (chat) => {
    const name = getChatDisplayName(chat);
    const unread = getUnreadCount(chat);
    const isGroup = chat.type === 'group';
    const lastMsg = chat.messages[chat.messages.length - 1];

    return (
      <div
        key={chat.id}
        className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
        onClick={() => onSelectChat(chat.id)}
        style={{ padding: '12px 16px', display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'center', borderRadius: 8, margin: '2px 8px', transition: 'background 0.2s', background: chat.id === activeChatId ? '#EFF6FF' : 'transparent' }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: isGroup ? '#F1F5F9' : '#EFF6FF', color: isGroup ? '#475569' : getColor(name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, border: '1px solid var(--border-color)' }}>
            {isGroup ? <Hash size={16} /> : getInitials(name)}
          </div>
          {/* Online Indicator mock */}
          {!isGroup && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, background: '#10B981', border: '2px solid white', borderRadius: '50%' }} />}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </span>
            {lastMsg && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {format(new Date(lastMsg.timestamp), 'h:mm a')}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: unread > 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: unread > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lastMsg ? (lastMsg.deleted ? 'Message deleted' : (lastMsg.attachments?.length > 0 ? `Sent a file` : lastMsg.text)) : 'No messages'}
            </span>
            {unread > 0 && (
              <div style={{ background: '#3B82F6', color: 'white', borderRadius: 10, padding: '2px 6px', fontSize: 11, fontWeight: 700, marginLeft: 8 }}>
                {unread}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title, items, icon) => {
    if (items.length === 0) return null;
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', marginBottom: 8, color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {icon} {title}
        </div>
        <div>{items.map(renderChatItem)}</div>
      </div>
    );
  };

  return (
    <div style={{ width: 320, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 700 }}>Messages</h2>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" placeholder="Search messages, people..." value={search} onChange={e => onSearchChange(e.target.value)} style={{ width: '100%', paddingLeft: 36, background: 'var(--bg-secondary)', border: '1px solid transparent' }} />
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {renderSection('Pinned', pinnedChats, <Pin size={12} />)}
        {renderSection('Favorites', favoriteChats, <Star size={12} />)}
        {renderSection('Channels', groupChats, <Hash size={12} />)}
        {renderSection('Direct Messages', directChats, <User size={12} />)}
      </div>
    </div>
  );
}
