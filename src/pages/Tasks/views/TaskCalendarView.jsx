import { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TASK_STATUS } from '../../../data/mockData';

export default function TaskCalendarView({ tasks, onOpenTask }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get padding days for the calendar grid
  const startDay = monthStart.getDay(); // 0 = Sunday, 1 = Monday
  const prefixDays = Array.from({ length: startDay }).map((_, i) => `prev-${i}`);
  
  const endDay = monthEnd.getDay();
  const suffixDays = Array.from({ length: 6 - endDay }).map((_, i) => `next-${i}`);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white', borderRadius: 16, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      
      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{format(currentMonth, 'MMMM yyyy')}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" style={{ padding: '8px', border: 'none' }} onClick={prevMonth}><ChevronLeft size={20} /></button>
          <button className="btn btn-outline" style={{ padding: '8px 16px' }} onClick={() => setCurrentMonth(new Date())}>Today</button>
          <button className="btn btn-outline" style={{ padding: '8px', border: 'none' }} onClick={nextMonth}><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-scroll-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="calendar-scroll-inner" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-color)', background: '#F8FAFC' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>
                {day}
              </div>
            ))}
          </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(120px, 1fr)', flex: 1, overflowY: 'auto', background: 'var(--border-color)', gap: 1 }}>
        {prefixDays.map(k => (
          <div key={k} style={{ background: '#F8FAFC' }} />
        ))}
        
        {daysInMonth.map(date => {
          const isToday = isSameDay(date, new Date());
          const dateTasks = tasks.filter(t => t.deadline && isSameDay(parseISO(t.deadline), date));
          
          return (
            <div key={date.toString()} style={{ background: 'white', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                <div style={{ 
                  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                  background: isToday ? 'var(--primary-color)' : 'transparent',
                  color: isToday ? 'white' : 'var(--text-primary)',
                  fontWeight: isToday ? 600 : 400,
                  fontSize: 14
                }}>
                  {format(date, 'd')}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1 }}>
                {dateTasks.map(task => {
                  const isCompleted = task.status === TASK_STATUS.COMPLETED || task.status === TASK_STATUS.APPROVED;
                  return (
                    <div 
                      key={task.id}
                      onClick={() => onOpenTask(task)}
                      style={{ 
                        fontSize: 11, padding: '4px 6px', borderRadius: 4, cursor: 'pointer',
                        background: isCompleted ? '#ECFDF5' : '#EFF6FF',
                        color: isCompleted ? '#059669' : '#1D4ED8',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        border: `1px solid ${isCompleted ? '#A7F3D0' : '#BFDBFE'}`
                      }}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {suffixDays.map(k => (
          <div key={k} style={{ background: '#F8FAFC' }} />
        ))}
        </div>
        </div>
      </div>
    </div>
  );
}
