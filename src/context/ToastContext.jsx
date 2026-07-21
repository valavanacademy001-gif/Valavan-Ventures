import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          border: '1px solid var(--border)',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          fontSize: '15px',
          fontWeight: '500'
        }}>
          {toast.type === 'success' && <CheckCircle2 size={24} color="var(--success)" />}
          {toast.type === 'error' && <AlertCircle size={24} color="var(--danger)" />}
          {toast.type === 'info' && <Info size={24} color="var(--primary)" />}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
