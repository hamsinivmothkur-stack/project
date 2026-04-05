import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import RevisionList from '../components/RevisionList';
import { isSameDay } from 'date-fns';
import { toast } from 'react-toastify';

const Revision = () => {
  const { revisionSchedules, subjects, updateRevision, deleteRevision } = useStudy();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all'); // all, pending, done

  const filteredRevisions = revisionSchedules.filter((r) => {
    if (filter === 'pending') return r.status !== 'Done';
    if (filter === 'done') return r.status === 'Done';
    return true;
  });

  const revisionsForDate = revisionSchedules.filter((r) =>
    isSameDay(new Date(r.revisionDate), selectedDate)
  );

  const handleComplete = (id) => {
    updateRevision(id, { status: 'Done' });
    toast.success('Revision marked as done!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this revision?')) {
      deleteRevision(id);
      toast.info('Revision deleted');
    }
  };

  // Highlight dates with revisions on calendar
  const tileContent = ({ date }) => {
    const hasRevision = revisionSchedules.some(
      (r) => isSameDay(new Date(r.revisionDate), date) && r.status !== 'Done'
    );
    const hasDone = revisionSchedules.some(
      (r) => isSameDay(new Date(r.revisionDate), date) && r.status === 'Done'
    );
    if (hasRevision) return <div className="calendar-dot calendar-dot--pending" />;
    if (hasDone) return <div className="calendar-dot calendar-dot--done" />;
    return null;
  };

  return (
    <div className="revision-page">
      <div className="revision-page__layout">
        {/* Calendar */}
        <motion.div
          className="revision-page__calendar chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="chart-card__title">📅 Revision Calendar</h3>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="study-calendar"
          />
          <div className="calendar-legend">
            <span><span className="calendar-dot calendar-dot--pending" /> Pending</span>
            <span><span className="calendar-dot calendar-dot--done" /> Done</span>
          </div>

          {revisionsForDate.length > 0 && (
            <div className="revision-page__date-list">
              <h4>Revisions on {selectedDate.toLocaleDateString()}</h4>
              <RevisionList
                revisions={revisionsForDate}
                subjects={subjects}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            </div>
          )}
        </motion.div>

        {/* All revisions */}
        <motion.div
          className="revision-page__list chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="revision-page__header">
            <h3 className="chart-card__title">All Revisions</h3>
            <div className="revision-page__filters">
              <button
                className={`tab ${filter === 'all' ? 'tab--active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({revisionSchedules.length})
              </button>
              <button
                className={`tab ${filter === 'pending' ? 'tab--active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({revisionSchedules.filter((r) => r.status !== 'Done').length})
              </button>
              <button
                className={`tab ${filter === 'done' ? 'tab--active' : ''}`}
                onClick={() => setFilter('done')}
              >
                Done ({revisionSchedules.filter((r) => r.status === 'Done').length})
              </button>
            </div>
          </div>
          <RevisionList
            revisions={filteredRevisions}
            subjects={subjects}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Revision;
