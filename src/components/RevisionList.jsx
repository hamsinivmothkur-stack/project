import { motion } from 'framer-motion';
import { MdCheckCircle, MdDelete, MdEventRepeat } from 'react-icons/md';
import { formatDate, isOverdue, isDateToday } from '../utils/helpers';

const RevisionList = ({ revisions, subjects, onComplete, onDelete }) => {
  if (!revisions || revisions.length === 0) {
    return (
      <div className="empty-state">
        <MdEventRepeat className="empty-state__icon" />
        <h3>No Revisions Scheduled</h3>
        <p>Complete topics to auto-schedule revision sessions.</p>
      </div>
    );
  }

  const sortedRevisions = [...revisions].sort(
    (a, b) => new Date(a.revisionDate) - new Date(b.revisionDate)
  );

  return (
    <div className="revision-list">
      {sortedRevisions.map((rev) => {
        const subject = subjects.find((s) => s.id === rev.subjectId);
        const overdue = isOverdue(rev.revisionDate) && rev.status !== 'Done';
        const today = isDateToday(rev.revisionDate);

        return (
          <motion.div
            key={rev.id}
            className={`revision-item ${rev.status === 'Done' ? 'revision-item--done' : ''} ${overdue ? 'revision-item--overdue' : ''} ${today ? 'revision-item--today' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            layout
          >
            <div className="revision-item__color" style={{ background: subject?.color || '#636e72' }} />
            <div className="revision-item__info">
              <h4 className="revision-item__topic">{rev.topicName}</h4>
              <p className="revision-item__subject">{subject?.name || 'Unknown Subject'}</p>
              <p className="revision-item__date">
                {today ? '📌 Today' : overdue ? '⚠️ Overdue' : `📅 ${formatDate(rev.revisionDate)}`}
              </p>
            </div>
            <div className="revision-item__actions">
              {rev.status !== 'Done' && (
                <button
                  className="btn btn--sm btn--success"
                  onClick={() => onComplete(rev.id)}
                >
                  <MdCheckCircle /> Done
                </button>
              )}
              <button className="icon-btn icon-btn--danger" onClick={() => onDelete(rev.id)}>
                <MdDelete />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RevisionList;
