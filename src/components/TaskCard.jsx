import { motion } from 'framer-motion';
import { MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdFlag, MdCalendarToday } from 'react-icons/md';
import { formatDate, getPriorityColor, isOverdue } from '../utils/helpers';

const TaskCard = ({ task, subjectName, onToggle, onEdit, onDelete }) => {
  const overdue = task.status !== 'Completed' && isOverdue(task.deadline);

  return (
    <motion.div
      className={`task-card ${task.status === 'Completed' ? 'task-card--done' : ''} ${overdue ? 'task-card--overdue' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <button className="task-card__check" onClick={() => onToggle(task.id)}>
        {task.status === 'Completed' ? (
          <MdCheckCircle className="task-card__check-icon task-card__check-icon--done" />
        ) : (
          <MdRadioButtonUnchecked className="task-card__check-icon" />
        )}
      </button>

      <div className="task-card__body">
        <h4 className="task-card__title">{task.title}</h4>
        <div className="task-card__meta">
          {subjectName && <span className="task-card__subject">{subjectName}</span>}
          {task.topic && <span className="task-card__topic">{task.topic}</span>}
        </div>
        <div className="task-card__footer">
          <span className="task-card__date" style={{ color: overdue ? '#ff4757' : 'var(--text-muted)' }}>
            <MdCalendarToday /> {task.deadline ? formatDate(task.deadline) : 'No deadline'}
          </span>
          <span className="task-card__priority" style={{ color: getPriorityColor(task.priority) }}>
            <MdFlag /> {task.priority}
          </span>
        </div>
      </div>

      <div className="task-card__actions">
        <button className="icon-btn" onClick={() => onEdit(task)} title="Edit">
          <MdEdit />
        </button>
        <button className="icon-btn icon-btn--danger" onClick={() => onDelete(task.id)} title="Delete">
          <MdDelete />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
