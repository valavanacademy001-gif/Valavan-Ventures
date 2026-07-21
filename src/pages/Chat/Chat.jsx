import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockUsers } from '../../data/mockData';
import { Hash, Phone, Video, Info } from 'lucide-react';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626'];
const getColor = (name) => COLORS[name?.charCodeAt(0) % COLORS.length] || COLORS[0];
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

export default function Chat() {
  const { chats, sendMessage, deleteMessage, addReaction, markChatRead } = useApp();
  const { currentUser } = useAuth();
  
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id || null);
  const [search, setSearch] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId);

  // Mark chat as read when opening it
  useEffect(() => {
    if (activeChatId && currentUser) {
      markChatRead(activeChatId, currentUser.id);
    }
  }, [activeChatId, chats, currentUser, markChatRead]);

  const handleSendMessage = (text, attachments) => {
    sendMessage(activeChatId, currentUser.id, text, attachments);
  };

  const getChatDisplayName = (chat) => {
    if (chat.type === 'group') return chat.name;
    const other = chat.members.find(id => id !== currentUser?.id);
    const user = mockUsers.find(u => u.id === other);
    return user?.name || chat.name;
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', margin: 24, borderRadius: 16, background: 'white', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* Sidebar */}
        <ChatSidebar 
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Main Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {activeChat ? (
            <>
              {/* Header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: activeChat.type === 'group' ? '#F1F5F9' : '#EFF6FF', color: activeChat.type === 'group' ? '#475569' : getColor(getChatDisplayName(activeChat)), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, border: '1px solid var(--border-color)' }}>
                    {activeChat.type === 'group' ? <Hash size={16} /> : getInitials(getChatDisplayName(activeChat))}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {getChatDisplayName(activeChat)}
                    </h2>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {activeChat.type === 'group' ? `${activeChat.members.length} members` : 'Online'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {activeChat.type === 'group' && (
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
                      {activeChat.members.slice(0, 3).map((uid, i) => {
                        const user = mockUsers.find(u => u.id === uid);
                        return (
                          <div key={uid} style={{ width: 28, height: 28, borderRadius: '50%', background: getColor(user?.name), color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, marginLeft: i > 0 ? -8 : 0, border: '2px solid white' }}>
                            {getInitials(user?.name)}
                          </div>
                        );
                      })}
                      {activeChat.members.length > 3 && (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E2E8F0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, marginLeft: -8, border: '2px solid white' }}>
                          +{activeChat.members.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  <button className="btn-icon"><Phone size={18} /></button>
                  <button className="btn-icon"><Video size={18} /></button>
                  <button className="btn-icon"><Info size={18} /></button>
                </div>
              </div>

              {/* Chat Window (Messages) */}
              <ChatWindow 
                chat={activeChat} 
                onDeleteMessage={deleteMessage}
                onAddReaction={addReaction}
              />

              {/* Chat Input */}
              <ChatInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Hash size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Your Messages</h3>
                <p style={{ margin: 0 }}>Select a chat or start a new conversation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
