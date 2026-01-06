import React from 'react';
import CountdownTimer from './CountdownTimer';
import { CheckCircle, Clock, Trash2, Sparkles, Edit2 } from 'lucide-react'; 

const priorityThemes = {
  High: { dot: 'bg-rose-500', accent: 'text-rose-400' },
  Medium: { dot: 'bg-amber-500', accent: 'text-amber-400' },
  Low: { dot: 'bg-emerald-500', accent: 'text-emerald-400' },
};

const AssignmentCard = ({ 
  assignment, 
  onDelete, 
  onEdit,
  onToggleComplete 
  // Removed onGeneratePlan prop
}) => {
  const theme = priorityThemes[assignment.priority];

  return (
    <div className={`glass-card relative rounded-[1.75rem] p-6 border-white/5 transition-all overflow-hidden ${assignment.completed ? 'opacity-50 grayscale-[0.3]' : ''}`}>
      {/* Background Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-10 rounded-full -mr-16 -mt-16 ${theme.dot}`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2.5 mb-2">
             <div className={`w-2 h-2 rounded-full ${theme.dot} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></div>
             <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${theme.accent}`}>{assignment.priority} Priority</span>
          </div>
          <h3 className={`text-lg font-bold text-white leading-snug line-clamp-2 ${assignment.completed ? 'line-through decoration-slate-500' : ''}`}>
            {assignment.title}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wide">{assignment.subject}</p>
        </div>
        <button 
          onClick={() => onToggleComplete(assignment.id)}
          className={`p-2.5 rounded-xl transition-all border ${assignment.completed ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
        >
          <CheckCircle size={22} />
        </button>
      </div>

      {assignment.description && (
        <div className="mb-4 relative z-10">
          <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
            {assignment.description}
          </p>
        </div>
      )}

      <div className="bg-black/20 rounded-2xl p-4 mb-5 border border-white/5 relative z-10">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">
          <Clock size={12} />
          <span>Timer</span>
        </div>
        <CountdownTimer dueDate={assignment.dueDate} />
      </div>

      <div className="flex justify-between items-center mt-auto relative z-10">
        {/* Removed the AI Roadmap button */}
        <div></div> {/* Empty div to maintain layout */}
        <div className="flex items-center gap-1">
            <button 
              onClick={() => onEdit(assignment)}
              className="p-2.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(assignment.id)}
              className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
        </div>
      </div>

      {assignment.completed && (
        <div className="absolute top-2 right-12 text-emerald-400/30 animate-pulse">
          <Sparkles size={16} />
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;