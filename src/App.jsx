import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Calendar, GraduationCap, BarChart3, Search, Sparkles, Activity, Bell, BellOff, CheckSquare, Filter, Clock, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { storageService } from './services/storageService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import CountdownTimer from './components/CountdownTimer';

// Neomorphism AssignmentModal component
const AssignmentModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'Medium',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subject: initialData.subject,
        dueDate: initialData.dueDate.slice(0, 16),
        priority: initialData.priority,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        subject: '',
        dueDate: '',
        priority: 'Medium',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="neo-card rounded-3xl w-full max-w-md shadow-soft-2xl">
        <div className="px-8 py-6 border-b border-slate-200/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {initialData ? 'Edit Task' : 'Add New Task'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Enter your assignment details</p>
            </div>
            <button onClick={onClose} className="neo-btn p-2 text-slate-500 hover:text-slate-800 rounded-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Title *</label>
            <input 
              required
              type="text" 
              className="neo-input w-full"
              placeholder="Enter assignment title"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Subject *</label>
              <input 
                required
                type="text" 
                className="neo-input w-full"
                placeholder="e.g., Mathematics"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Priority</label>
              <select 
                className="neo-select w-full"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Due Date *</label>
            <input 
              required
              type="datetime-local" 
              className="neo-input w-full"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Description (Optional)</label>
            <textarea 
              rows={3}
              className="neo-input w-full resize-none"
              placeholder="Add notes or specific requirements..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 neo-btn-primary flex items-center justify-center gap-2"
          >
            {initialData ? 'Update Assignment' : 'Create Assignment'}
            <Plus size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

// Neomorphism AssignmentCard component with CountdownTimer
const AssignmentCard = ({ 
  assignment, 
  onDelete, 
  onEdit,
  onToggleComplete 
}) => {
  const priorityColors = {
    High: { 
      bg: 'bg-rose-500/10', 
      text: 'text-rose-700', 
      border: 'border-rose-500/20',
      dot: 'bg-rose-500',
      timeBg: 'bg-rose-500/5'
    },
    Medium: { 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-700', 
      border: 'border-amber-500/20',
      dot: 'bg-amber-500',
      timeBg: 'bg-amber-500/5'
    },
    Low: { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-700', 
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-500',
      timeBg: 'bg-emerald-500/5'
    },
  };

  const theme = priorityColors[assignment.priority];
  
  return (
    <div className={`neo-card rounded-3xl p-6 transition-all duration-300 hover:shadow-soft-xl ${assignment.completed ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`${theme.bg} ${theme.border} px-3 py-1 rounded-full flex items-center gap-1.5`}>
                <div className={`w-2 h-2 rounded-full ${theme.dot}`}></div>
                <span className={`text-xs font-bold uppercase ${theme.text}`}>{assignment.priority}</span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {assignment.subject}
              </div>
            </div>
            
            <button 
              onClick={() => onToggleComplete(assignment.id)}
              className={`neo-btn p-2 rounded-xl ${assignment.completed ? 'bg-emerald-500/10 text-emerald-700' : 'text-slate-500 hover:text-emerald-700'}`}
            >
              <CheckSquare size={20} />
            </button>
          </div>
          
          <h3 className={`text-xl font-bold text-slate-800 mb-3 ${assignment.completed ? 'line-through text-slate-500' : ''}`}>
            {assignment.title}
          </h3>
          
          {assignment.description && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
              {assignment.description}
            </p>
          )}
          
          {/* Countdown Timer Section */}
          <div className={`${theme.timeBg} p-3 rounded-2xl mb-4 border ${theme.border}`}>
            <CountdownTimer dueDate={assignment.dueDate} completed={assignment.completed} />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200/50">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(assignment)}
            className="neo-btn-sm text-slate-600 hover:text-slate-800 p-2 rounded-xl"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(assignment.id)}
            className="neo-btn-sm text-slate-600 hover:text-rose-700 p-2 rounded-xl"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
          assignment.completed 
            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' 
            : 'bg-slate-200/50 text-slate-700 border border-slate-300/50'
        }`}>
          {assignment.completed ? 'Completed' : 'Active'}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    notify24h: true,
    notify1h: true,
    notify10min: true,
    notifyOverdue: true
  });

  const notifiedRef = useRef(new Set());
  const audioRef = useRef(null);

  // Load notification settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save notification settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    const saved = storageService.loadAssignments();
    setAssignments(saved);
  }, []);

  useEffect(() => {
    storageService.saveAssignments(assignments);
  }, [assignments]);

  // Enhanced notification system with audio
  useEffect(() => {
    if (notificationPermission !== 'granted' || !notificationSettings.enabled) return;

    const checkDeadlines = () => {
      const now = new Date();
      assignments.forEach((assignment) => {
        if (assignment.completed) return;

        const dueDate = new Date(assignment.dueDate);
        const diffMs = dueDate.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        // Check for specific thresholds
        const thresholds = [];
        if (notificationSettings.notify24h && diffHours <= 24 && diffHours > 23) thresholds.push(24 * 60);
        if (notificationSettings.notify1h && diffMins <= 60 && diffMins > 55) thresholds.push(60);
        if (notificationSettings.notify10min && diffMins <= 10 && diffMins > 5) thresholds.push(10);
        
        thresholds.forEach(threshold => {
          const key = `${assignment.id}-${threshold}`;
          if (!notifiedRef.current.has(key)) {
            let message = '';
            if (threshold === 1440) message = `${assignment.title} is due in 24 hours!`;
            else if (threshold === 60) message = `${assignment.title} is due in 1 hour!`;
            else if (threshold === 10) message = `${assignment.title} is due in 10 minutes!`;
            
            new Notification('⏰ Deadline Alert', {
              body: `${message}\nSubject: ${assignment.subject}`,
              icon: '/favicon.ico'
            });
            
            // Play notification sound
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            
            notifiedRef.current.add(key);
          }
        });

        // Check for overdue assignments
        if (notificationSettings.notifyOverdue && diffMs < 0) {
          const overdueKey = `${assignment.id}-overdue`;
          if (!notifiedRef.current.has(overdueKey)) {
            new Notification('🚨 Assignment Overdue!', {
              body: `${assignment.title} is now overdue!\nSubject: ${assignment.subject}`,
              icon: '/favicon.ico'
            });
            
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
            
            notifiedRef.current.add(overdueKey);
          }
        }
      });
    };

    const interval = setInterval(checkDeadlines, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [assignments, notificationPermission, notificationSettings]);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Notifications are not supported in this browser.');
      return;
    }
    
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      new Notification('🔔 Notifications Enabled', {
        body: 'You will receive alerts for upcoming assignment deadlines.',
      });
      
      // Enable notifications by default when permission is granted
      setNotificationSettings(prev => ({ ...prev, enabled: true }));
    }
  };

  const toggleNotificationSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle assignment actions (keep existing functions)
  const handleAddAssignment = (data) => {
    const newAssignment = {
      id: crypto.randomUUID(),
      ...data,
      completed: false
    };
    setAssignments(prev => [newAssignment, ...prev]);
    setIsModalOpen(false);
    
    // Clear notification for this new assignment
    ['1440', '60', '10', 'overdue'].forEach(threshold => {
      notifiedRef.current.delete(`${newAssignment.id}-${threshold}`);
    });
  };

  const handleUpdateAssignment = (data) => {
    if (!editingAssignment) return;
    setAssignments(prev => prev.map(a => 
      a.id === editingAssignment.id ? { ...a, ...data } : a
    ));
    setEditingAssignment(null);
    setIsModalOpen(false);
    
    // Clear notifications for updated assignment
    ['1440', '60', '10', 'overdue'].forEach(threshold => {
      notifiedRef.current.delete(`${editingAssignment.id}-${threshold}`);
    });
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    
    // Clear notifications for deleted assignment
    ['1440', '60', '10', 'overdue'].forEach(threshold => {
      notifiedRef.current.delete(`${id}-${threshold}`);
    });
  };

  const handleToggleComplete = (id) => {
    setAssignments(prev => prev.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
    
    // Clear notifications for completed assignment
    ['1440', '60', '10', 'overdue'].forEach(threshold => {
      notifiedRef.current.delete(`${id}-${threshold}`);
    });
  };

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  // Get upcoming deadlines (for display in header)
  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return assignments
      .filter(a => !a.completed && new Date(a.dueDate) > now && new Date(a.dueDate) <= next24h)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3); // Show only 3 upcoming deadlines
  }, [assignments]);

  // Rest of the code remains the same...
  const filteredAssignments = useMemo(() => {
    let filtered = assignments.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filter === 'active') filtered = filtered.filter(a => !a.completed);
    if (filter === 'completed') filtered = filtered.filter(a => a.completed);

    if (sortBy === 'dueDate') {
      return filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
    return filtered;
  }, [assignments, searchQuery, filter, sortBy]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.completed).length;
    const pending = total - completed;
    const highPriority = assignments.filter(a => a.priority === 'High' && !a.completed).length;
    const overdue = assignments.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length;
    const upcoming24h = assignments.filter(a => {
      if (a.completed) return false;
      const due = new Date(a.dueDate);
      const now = new Date();
      const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 24;
    }).length;
    
    const priorityData = [
      { name: 'High', value: assignments.filter(a => a.priority === 'High').length, color: '#f43f5e' },
      { name: 'Medium', value: assignments.filter(a => a.priority === 'Medium').length, color: '#f59e0b' },
      { name: 'Low', value: assignments.filter(a => a.priority === 'Low').length, color: '#10b981' },
    ].filter(d => d.value > 0);

    return { total, completed, pending, highPriority, overdue, upcoming24h, priorityData };
  }, [assignments]);

  // Notification Settings Modal
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Hidden audio element for notification sounds */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="neo-card rounded-3xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="neo-icon bg-slate-700 text-white">
                <GraduationCap size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">DeadlineMaster</h1>
                <p className="text-slate-600 mt-1">Track and manage your academic assignments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Settings Button */}
              <button 
                onClick={() => setShowNotificationSettings(true)}
                className={`neo-btn p-3 ${notificationSettings.enabled ? 'text-slate-800' : 'text-slate-500'}`}
                title="Notification Settings"
              >
                <Bell size={20} />
              </button>
              
              {notificationPermission !== 'granted' && (
                <button 
                  onClick={requestNotificationPermission}
                  className="neo-btn text-slate-600 hover:text-slate-800 px-4 py-2"
                >
                  Enable Notifications
                </button>
              )}
              
              <button 
                onClick={() => {
                  setEditingAssignment(null);
                  setIsModalOpen(true);
                }}
                className="neo-btn-primary flex items-center gap-2 px-5 py-3"
              >
                <Plus size={18} />
                <span className="font-bold">New Assignment</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search assignments by title or subject..." 
                className="neo-input w-full pl-12 pr-4 py-3.5 rounded-2xl"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="neo-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="neo-icon-sm bg-slate-700/10 text-slate-700">
                <Activity size={20} />
              </div>
            </div>
          </div>
          
          <div className="neo-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.completed}</p>
              </div>
              <div className="neo-icon-sm bg-emerald-500/10 text-emerald-700">
                <CheckSquare size={20} />
              </div>
            </div>
          </div>
          
          <div className="neo-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-rose-700">{stats.overdue}</p>
              </div>
              <div className="neo-icon-sm bg-rose-500/10 text-rose-700">
                <AlertCircle size={20} />
              </div>
            </div>
          </div>
          
          <div className="neo-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Due in 24h</p>
                <p className="text-2xl font-bold text-amber-700">{stats.upcoming24h}</p>
              </div>
              <div className="neo-icon-sm bg-amber-500/10 text-amber-700">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Filters */}
          <div className="lg:col-span-1 space-y-8">
            {/* Priority Chart */}
            <div className="neo-card rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-slate-700" />
                Priority Distribution
              </h3>
              
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.priorityData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        color: '#334155',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-600">Total</p>
                    <p className="text-2xl font-bold text-slate-800">{assignments.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                {['High', 'Medium', 'Low'].map((name) => {
                  const color = name === 'High' ? '#f43f5e' : name === 'Medium' ? '#f59e0b' : '#10b981';
                  const count = assignments.filter(a => a.priority === name).length;
                  return (
                    <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                        <span className="text-sm font-medium text-slate-700">{name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="neo-card rounded-3xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Filter size={20} className="text-slate-700" />
                Filters & Sort
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'active', 'completed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`neo-chip ${filter === status ? 'neo-chip-active' : ''}`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sort by</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'dueDate', label: 'Due Date' },
                      { id: 'priority', label: 'Priority' }
                    ].map((sort) => (
                      <button
                        key={sort.id}
                        onClick={() => setSortBy(sort.id)}
                        className={`neo-chip ${sortBy === sort.id ? 'neo-chip-active' : ''}`}
                      >
                        {sort.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Assignments */}
          <div className="lg:col-span-2">
            <div className="neo-card rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Active Assignments</h2>
                  <p className="text-slate-600 mt-1">
                    {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={16} />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
                {filteredAssignments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-block p-6 rounded-2xl bg-slate-100/50 mb-4">
                      <Calendar size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No assignments found</h3>
                    <p className="text-slate-600 mb-6">
                      {searchQuery ? 'Try a different search term' : 'Create your first assignment to get started'}
                    </p>
                    <button 
                      onClick={() => {
                        setEditingAssignment(null);
                        setIsModalOpen(true);
                      }}
                      className="neo-btn-primary inline-flex items-center gap-2 px-6 py-3"
                    >
                      <Plus size={18} />
                      Create First Assignment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {filteredAssignments.map(assignment => (
                      <AssignmentCard 
                        key={assignment.id}
                        assignment={assignment}
                        onDelete={handleDeleteAssignment}
                        onEdit={handleEditClick}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => {
            setEditingAssignment(null);
            setIsModalOpen(true);
          }}
          className="neo-btn-floating w-14 h-14"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Assignment Modal */}
      <AssignmentModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={editingAssignment ? handleUpdateAssignment : handleAddAssignment}
        initialData={editingAssignment || undefined}
      />

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="neo-card rounded-3xl w-full max-w-md shadow-soft-2xl">
            <div className="px-8 py-6 border-b border-slate-200/50">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Notification Settings</h2>
                  <p className="text-sm text-slate-500 mt-1">Configure deadline alerts</p>
                </div>
                <button 
                  onClick={() => setShowNotificationSettings(false)}
                  className="neo-btn p-2 text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/50">
                <div>
                  <p className="font-medium text-slate-800">Enable Notifications</p>
                  <p className="text-sm text-slate-600">Receive alerts for deadlines</p>
                </div>
                <button
                  onClick={() => toggleNotificationSetting('enabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              {notificationSettings.enabled && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/30">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-600" />
                      <span className="text-slate-700">24 hours before</span>
                    </div>
                    <button
                      onClick={() => toggleNotificationSetting('notify24h')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.notify24h ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.notify24h ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/30">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-600" />
                      <span className="text-slate-700">1 hour before</span>
                    </div>
                    <button
                      onClick={() => toggleNotificationSetting('notify1h')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.notify1h ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.notify1h ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/30">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-600" />
                      <span className="text-slate-700">10 minutes before</span>
                    </div>
                    <button
                      onClick={() => toggleNotificationSetting('notify10min')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.notify10min ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.notify10min ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100/30">
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className="text-rose-600" />
                      <span className="text-slate-700">When overdue</span>
                    </div>
                    <button
                      onClick={() => toggleNotificationSetting('notifyOverdue')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${notificationSettings.notifyOverdue ? 'bg-rose-500' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationSettings.notifyOverdue ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-slate-200/50">
                <button
                  onClick={() => {
                    // Clear all notifications
                    notifiedRef.current.clear();
                    setShowNotificationSettings(false);
                  }}
                  className="w-full neo-btn py-3 text-slate-700 font-medium rounded-xl"
                >
                  Clear All Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;