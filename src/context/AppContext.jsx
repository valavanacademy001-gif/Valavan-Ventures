import { createContext, useContext, useState } from 'react';
import {
  mockTasks, mockProjects, mockUsers, mockAttendance,
  mockLeaves, mockPayslips, mockNotifications, mockChats, mockAnnouncements, mockActivityFeed, TASK_STATUS, liveTimeline, HOLIDAYS
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(mockTasks);
  const [projects, setProjects] = useState(mockProjects);
  const [employees, setEmployees] = useState(mockUsers);
  const [attendance, setAttendance] = useState(mockAttendance);
  const [leaves, setLeaves] = useState(mockLeaves);
  const [payslips, setPayslips] = useState(mockPayslips);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [chats, setChats] = useState(mockChats);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [activityFeed, setActivityFeed] = useState(mockActivityFeed);
  const [timeline, setTimeline] = useState(liveTimeline);
  const [holidays, setHolidays] = useState(HOLIDAYS);
  
  const [notificationSettings, setNotificationSettings] = useState({
    desktop: true, email: true, task: true, chat: true, leave: true, attendance: true, announcement: true
  });

  // Task actions
  const logTaskTimeline = (taskId, action, userId, targetId = null, extra = {}) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newTimelineEvent = { id: `tl${Date.now()}`, action, userId, targetId, timestamp: new Date().toISOString(), ...extra };
      return { ...t, timeline: [...(t.timeline || []), newTimelineEvent] };
    }));
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const addCommentToTask = (taskId, userId, text) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newComment = { id: `cm${Date.now()}`, userId, text, timestamp: new Date().toISOString() };
      return { ...t, comments: [...(t.comments || []), newComment] };
    }));
    logTaskTimeline(taskId, 'commented', userId);
  };

  const submitForReview = (taskId, userId, comment, files = []) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updates = { status: TASK_STATUS.SUBMITTED };
    if (files.length > 0) {
      updates.attachments = [...(task.attachments || []), ...files.map(f => typeof f === 'string' ? f : f.name)];
    }
    
    updateTask(taskId, updates);
    if (comment) addCommentToTask(taskId, userId, comment);
    logTaskTimeline(taskId, 'submitted', userId);
    
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const rev = { version: (t.revisionHistory?.length || 0) + 1, note: 'Submitted for review', date: new Date().toISOString() };
      return { ...t, revisionHistory: [...(t.revisionHistory || []), rev] };
    }));

    addNotification({
      userId: task.assignedBy,
      type: 'task_submitted',
      title: 'Task Submitted for Review',
      message: `${task.title} has been submitted by ${employees.find(e=>e.id===userId)?.name}.`,
      link: '/tasks',
    });
  };

  const approveTask = (taskId, adminId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { status: TASK_STATUS.COMPLETED, progress: 100 });
    logTaskTimeline(taskId, 'approved', adminId);
    logTaskTimeline(taskId, 'completed', adminId);
    
    addNotification({
      userId: task.assignedTo,
      type: 'task_approved',
      title: 'Task Approved',
      message: `Your task "${task.title}" was approved and marked as complete!`,
      link: '/tasks',
    });
  };

  const rejectTask = (taskId, adminId, comment) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { status: TASK_STATUS.REJECTED });
    if (comment) addCommentToTask(taskId, adminId, comment);
    logTaskTimeline(taskId, 'rejected', adminId);
    
    addNotification({
      userId: task.assignedTo,
      type: 'task_rejected',
      title: 'Task Rejected',
      message: `Your task "${task.title}" was rejected. Please review the comments.`,
      link: '/tasks',
    });
  };

  const requestChanges = (taskId, adminId, comment) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask(taskId, { status: TASK_STATUS.CHANGES_NEEDED });
    if (comment) addCommentToTask(taskId, adminId, comment);
    logTaskTimeline(taskId, 'changes_requested', adminId);
    
    addNotification({
      userId: task.assignedTo,
      type: 'changes_needed',
      title: 'Changes Requested',
      message: `Changes requested on task "${task.title}".`,
      link: '/tasks',
    });
  };

  const addTask = (task, creatorId) => {
    const newTask = {
      ...task,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: TASK_STATUS.ASSIGNED,
      progress: 0,
      comments: [],
      checklist: task.checklist || [],
      attachments: task.attachments || [],
      revisionHistory: [],
      timeline: [
        { id: `tl${Date.now()}_1`, action: 'created', userId: creatorId, timestamp: new Date().toISOString() },
        { id: `tl${Date.now()}_2`, action: 'assigned', userId: creatorId, targetId: task.assignedTo, timestamp: new Date().toISOString() }
      ],
      estimatedHours: task.estimatedHours || 0,
      actualHours: 0
    };
    setTasks(prev => [newTask, ...prev]);
    addNotification({
      userId: task.assignedTo,
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `"${task.title}" has been assigned to you.`,
      link: '/tasks',
    });
  };

  // Leave actions
  const applyLeave = (leave) => {
    const newLeave = { ...leave, id: `l${Date.now()}`, status: 'pending', appliedAt: new Date().toISOString() };
    setLeaves(prev => [newLeave, ...prev]);
  };

  const approveLeave = (leaveId, approverId) => {
    const leave = leaves.find(l => l.id === leaveId);
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'approved', approvedBy: approverId } : l));
    if (leave) {
      addNotification({
        userId: leave.userId,
        type: 'leave_approved',
        title: 'Leave Approved',
        message: `Your leave request has been approved.`,
        link: '/leaves',
      });
    }
  };

  const rejectLeave = (leaveId) => {
    const leave = leaves.find(l => l.id === leaveId);
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status: 'rejected' } : l));
    if (leave) {
      addNotification({
        userId: leave.userId,
        type: 'leave_rejected',
        title: 'Leave Rejected',
        message: `Your leave request has been rejected.`,
        link: '/leaves',
      });
    }
  };

  // Notification actions
  const addNotification = (notif) => {
    setNotifications(prev => [{ ...notif, id: `n${Date.now()}`, read: false, createdAt: new Date().toISOString() }, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllRead = (userId) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  // Chat actions
  const sendMessage = (chatId, senderId, text, attachments = []) => {
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      messages: [...c.messages, { id: `m${Date.now()}`, senderId, text, timestamp: new Date().toISOString(), readBy: [], attachments }]
    } : c));
  };

  const markChatRead = (chatId, userId) => {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      return {
        ...c,
        messages: c.messages.map(m => m.readBy?.includes(userId) ? m : { ...m, readBy: [...(m.readBy || []), userId] })
      };
    }));
  };

  const pinChat = (chatId, isPinned) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, pinned: isPinned } : c));
  };

  const toggleFavoriteChat = (chatId, userId) => {
    setChats(prev => prev.map(c => {
      if (c.id !== chatId) return c;
      const favs = c.favorites || [];
      return { ...c, favorites: favs.includes(userId) ? favs.filter(id => id !== userId) : [...favs, userId] };
    }));
  };

  const deleteMessage = (chatId, messageId) => {
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      messages: c.messages.map(m => m.id === messageId ? { ...m, text: 'This message was deleted.', deleted: true, attachments: [] } : m)
    } : c));
  };

  const addReaction = (chatId, messageId, emoji, userId) => {
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      messages: c.messages.map(m => {
        if (m.id !== messageId) return m;
        const reactions = { ...(m.reactions || {}) };
        if (!reactions[emoji]) reactions[emoji] = [];
        if (reactions[emoji].includes(userId)) {
          reactions[emoji] = reactions[emoji].filter(id => id !== userId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji].push(userId);
        }
        return { ...m, reactions };
      })
    } : c));
  };
  
  const createGroup = (name, members) => {
    const newGroup = {
      id: `ch${Date.now()}`,
      type: 'group',
      name,
      members,
      avatar: null,
      pinned: false,
      favorites: [],
      messages: []
    };
    setChats(prev => [newGroup, ...prev]);
  };

  // Activity Feed
  const logActivity = (userId, action, type) => {
    setActivityFeed(prev => [{ id: `act${Date.now()}`, userId, action, timestamp: new Date().toISOString(), type }, ...prev]);
  };

  // Announcements
  const createAnnouncement = (ann) => {
    setAnnouncements(prev => [{ ...ann, id: `an${Date.now()}`, postedAt: new Date().toISOString() }, ...prev]);
  };
  
  const deleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Attendance & Leaves
  const importAttendance = (records) => {
    // Records should be array of objects: { userId, date, status, checkIn, checkOut, workingHours, lateMinutes, remarks }
    setAttendance(prev => {
      let updated = [...prev];
      records.forEach(r => {
        const existingIdx = updated.findIndex(a => a.userId === r.userId && a.date === r.date);
        if (existingIdx >= 0) {
          updated[existingIdx] = { ...updated[existingIdx], ...r };
        } else {
          updated.push({ ...r, id: `a${Date.now()}_${Math.random()}` });
        }
      });
      return updated;
    });
  };

  const updateAttendance = (id, updates) => {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const addAttendance = (record) => {
    const newRecord = { ...record, id: `a${Date.now()}` };
    setAttendance(prev => [newRecord, ...prev]);
  };
  
  const deleteAttendance = (id) => {
    setAttendance(prev => prev.filter(a => a.id !== id));
  };

  const addHoliday = (holiday) => {
    setHolidays(prev => [...prev, { ...holiday, id: `h${Date.now()}` }]);
  };

  // Attendance calculation logic
  const calculateAttendanceMetrics = (inTime, outTime) => {
    if (!inTime) return { workedMins: 0, lateMins: 0, overtimeMins: 0, earlyMins: 0, status: 'absent' };
    
    const [inH, inM] = inTime.split(':').map(Number);
    const inTotalMins = inH * 60 + inM;
    
    // Office timings
    const startMins = 10 * 60; // 10:00 AM
    const graceEndMins = 10 * 60 + 10; // 10:10 AM
    const endMins = 18 * 60; // 6:00 PM
    
    let earlyMins = 0;
    let lateMins = 0;
    let status = 'present';
    
    if (inTotalMins < startMins) {
      earlyMins = startMins - inTotalMins;
      status = 'early';
    } else if (inTotalMins <= graceEndMins) {
      status = 'on_time';
    } else {
      lateMins = inTotalMins - graceEndMins;
      status = 'late';
    }
    
    if (!outTime) return { workedMins: 0, lateMins, overtimeMins: 0, earlyMins, status };
    
    const [outH, outM] = outTime.split(':').map(Number);
    const outTotalMins = outH * 60 + outM;
    
    let workedMins = outTotalMins - inTotalMins;
    if (workedMins < 0) workedMins = 0; // Cross midnight not supported for standard shifts
    
    let overtimeMins = 0;
    if (outTotalMins > endMins) {
      overtimeMins = outTotalMins - endMins;
    }
    
    return { workedMins, lateMins, overtimeMins, earlyMins, status };
  };

  // Auto calculate earned leaves for exactly 4 Sundays logic
  const calculateEarnedLeaves = (monthStr) => {
    // monthStr format 'YYYY-MM'
    const [year, month] = monthStr.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    let sundayCount = 0;
    while (date.getMonth() === month - 1) {
      if (date.getDay() === 0) sundayCount++;
      date.setDate(date.getDate() + 1);
    }
    
    if (sundayCount === 4) {
      // Credit 1 EL to all active users
      setEmployees(prev => prev.map(user => {
        if (!user.leaveBalance) return user;
        return {
          ...user,
          leaveBalance: {
            ...user.leaveBalance,
            earned: user.leaveBalance.earned + 1
          }
        };
      }));
      return true; // Indicates EL credited
    }
    return false; // Indicates EL NOT credited (5 Sundays)
  };

  // Employee
  const addEmployee = (emp) => {
    // Generate new EMP ID e.g. EMP-1009
    const maxId = employees.reduce((max, e) => {
      if (e.employeeId?.startsWith('EMP-')) {
        const num = parseInt(e.employeeId.split('-')[1]);
        return num > max ? num : max;
      }
      return max;
    }, 1000);
    const employeeId = `EMP-${maxId + 1}`;
    
    const newEmp = { 
      ...emp, 
      id: `u${Date.now()}`, 
      employeeId,
      performanceScore: 80, 
      attendancePercent: 90,
      leaveBalance: { sick: 5, casual: 5, earned: 5 },
      documents: []
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  const updateEmployee = (id, updates) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return (
    <AppContext.Provider value={{
      tasks, projects, employees, attendance, leaves, payslips,
      notifications, chats, announcements, activityFeed, timeline, holidays,
      notificationSettings, setNotificationSettings,
      updateTask, submitForReview, approveTask, rejectTask, requestChanges, addTask, addCommentToTask, logTaskTimeline,
      applyLeave, approveLeave, rejectLeave,
      addNotification, markNotificationRead, markAllRead,
      sendMessage, markChatRead, pinChat, toggleFavoriteChat, deleteMessage, addReaction, createGroup,
      logActivity, createAnnouncement, deleteAnnouncement,
      importAttendance, updateAttendance, addAttendance, deleteAttendance, addHoliday, calculateEarnedLeaves, calculateAttendanceMetrics,
      addEmployee, updateEmployee, deleteEmployee,
      setProjects, setAnnouncements, setHolidays,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
