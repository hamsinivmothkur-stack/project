import { motion } from 'framer-motion';
import { MdEdit, MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useState } from 'react';

const SubjectCard = ({ subject, topics, onEdit, onDelete, onTopicClick, onAddTopic }) => {
  const [expanded, setExpanded] = useState(false);
  const completedCount = topics.filter((t) => t.status === 'Completed').length;
  const percentage = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  return (
    <motion.div
      className="subject-card"
      style={{ '--subject-color': subject.color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="subject-card__header">
        <div className="subject-card__color" style={{ background: subject.color }} />
        <div className="subject-card__info">
          <h3 className="subject-card__name">{subject.name}</h3>
          <p className="subject-card__desc">{subject.description}</p>
        </div>
        <div className="subject-card__actions">
          <button className="icon-btn" onClick={() => onEdit(subject)} title="Edit">
            <MdEdit />
          </button>
          <button className="icon-btn icon-btn--danger" onClick={() => onDelete(subject.id)} title="Delete">
            <MdDelete />
          </button>
        </div>
      </div>

      <div className="subject-card__progress">
        <div className="subject-card__progress-info">
          <span>{completedCount}/{topics.length} topics</span>
          <span>{percentage}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar__fill"
            style={{ background: subject.color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      <button className="subject-card__expand" onClick={() => setExpanded(!expanded)}>
        <span>{expanded ? 'Hide Topics' : 'Show Topics'}</span>
        {expanded ? <MdExpandLess /> : <MdExpandMore />}
      </button>

      {expanded && (
        <motion.div
          className="subject-card__topics"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {topics.length === 0 ? (
            <p className="subject-card__empty">No topics yet. Add one!</p>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                className="topic-item"
                onClick={() => onTopicClick && onTopicClick(topic)}
              >
                <div className="topic-item__info">
                  <span className="topic-item__name">{topic.name}</span>
                  <span className={`badge badge--${topic.status?.toLowerCase().replace(/\s/g, '-')}`}>
                    {topic.status}
                  </span>
                </div>
                <span className={`badge badge--outline badge--${topic.difficulty?.toLowerCase()}`}>
                  {topic.difficulty}
                </span>
              </div>
            ))
          )}
          <button className="btn btn--sm btn--ghost" onClick={() => onAddTopic(subject.id)}>
            + Add Topic
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubjectCard;
