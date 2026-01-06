import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

const CountdownTimer = ({ dueDate, completed = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isOverdue: false,
    isUrgent: false,
    isWarning: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (completed) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isOverdue: false,
          isUrgent: false,
          isWarning: false
        });
        return;
      }

      const due = new Date(dueDate);
      const now = new Date();
      const difference = due.getTime() - now.getTime();
      
      if (difference > 0) {
        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        // Determine urgency levels
        const totalHours = days * 24 + hours;
        const totalMinutes = totalHours * 60 + minutes;
        
        const isUrgent = totalHours < 24; // Less than 24 hours
        const isWarning = totalHours >= 24 && totalHours < 72; // 1-3 days
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          totalSeconds,
          isOverdue: false,
          isUrgent,
          isWarning
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isOverdue: true,
          isUrgent: false,
          isWarning: false
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [dueDate, completed]);

  // Get time color based on status
  const getTimeColor = () => {
    if (completed) return 'text-emerald-600';
    if (timeLeft.isOverdue) return 'text-rose-600';
    if (timeLeft.isUrgent) return 'text-rose-600';
    if (timeLeft.isWarning) return 'text-amber-600';
    return 'text-emerald-600';
  };

  // Get background color based on status
  const getTimeBg = () => {
    if (completed) return 'bg-emerald-500/10 border-emerald-500/20';
    if (timeLeft.isOverdue) return 'bg-rose-500/10 border-rose-500/20';
    if (timeLeft.isUrgent) return 'bg-rose-500/10 border-rose-500/20';
    if (timeLeft.isWarning) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  // Get status message
  const getStatusMessage = () => {
    if (completed) return 'Completed';
    if (timeLeft.isOverdue) return 'Overdue';
    
    const totalHours = timeLeft.days * 24 + timeLeft.hours;
    const totalMinutes = totalHours * 60 + timeLeft.minutes;
    
    if (totalMinutes < 60) return 'Less than 1 hour';
    if (totalHours < 24) return `${totalHours} hours left`;
    if (timeLeft.days < 7) return `${timeLeft.days} days left`;
    return `${Math.floor(timeLeft.days / 7)} weeks left`;
  };

  // Get status icon
  const getStatusIcon = () => {
    if (completed) return <CheckCircle size={14} />;
    if (timeLeft.isOverdue) return <AlertCircle size={14} />;
    return <Clock size={14} />;
  };

  // Format time for display
  const formatTime = (value) => {
    return String(value).padStart(2, '0');
  };

  if (completed) {
    return (
      <div className={`${getTimeBg()} p-3 rounded-2xl border`}>
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle size={16} />
          <span className="text-sm font-semibold">Completed</span>
        </div>
      </div>
    );
  }

  if (timeLeft.isOverdue) {
    return (
      <div className={`${getTimeBg()} p-3 rounded-2xl border`}>
        <div className="flex items-center justify-center gap-2 text-rose-600 mb-2">
          <AlertCircle size={16} />
          <span className="text-sm font-semibold">Overdue!</span>
        </div>
        <div className="text-xs text-slate-600 text-center">
          Was due on {new Date(dueDate).toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <div className={`${getTimeBg()} p-3 rounded-2xl border`}>
      {/* Status Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-sm font-semibold ${getTimeColor()}`}>
            {getStatusMessage()}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {new Date(dueDate).toLocaleDateString()}
        </span>
      </div>

      {/* Time Units */}
      <div className="grid grid-cols-4 gap-1">
        {timeLeft.days > 0 && (
          <div className="neo-chip text-center py-1">
            <div className={`text-sm font-bold ${getTimeColor()}`}>
              {formatTime(timeLeft.days)}
            </div>
            <div className="text-[10px] text-slate-500">DAYS</div>
          </div>
        )}
        <div className="neo-chip text-center py-1">
          <div className={`text-sm font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft.hours)}
          </div>
          <div className="text-[10px] text-slate-500">HRS</div>
        </div>
        <div className="neo-chip text-center py-1">
          <div className={`text-sm font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft.minutes)}
          </div>
          <div className="text-[10px] text-slate-500">MIN</div>
        </div>
        <div className="neo-chip text-center py-1">
          <div className={`text-sm font-bold ${getTimeColor()}`}>
            {formatTime(timeLeft.seconds)}
          </div>
          <div className="text-[10px] text-slate-500">SEC</div>
        </div>
      </div>

      {/* Progress Bar */}
      {!timeLeft.isOverdue && !completed && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Time remaining</span>
            <span>
              {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
              {timeLeft.hours}h {timeLeft.minutes}m
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getTimeColor().replace('text-', 'bg-')} rounded-full transition-all duration-1000`}
              style={{
                width: `${Math.min(100, (timeLeft.totalSeconds / (30 * 24 * 60 * 60)) * 100)}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;