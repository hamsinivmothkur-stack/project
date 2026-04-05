import { motion } from 'framer-motion';
import { MdTask, MdCheckCircle, MdPending, MdWarning, MdEventRepeat } from 'react-icons/md';
import useProgress from '../hooks/useProgress';
import { useStudy } from '../context/StudyContext';
import { SubjectProgressChart, CompletionDonut, WeeklyChart } from '../components/ProgressChart';
import RevisionList from '../components/RevisionList';
import QuoteWidget from '../components/QuoteWidget';
import { formatDate } from '../utils/helpers';

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    className="stat-card"
    style={{ '--stat-color': color }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="stat-card__icon" style={{ background: `${color}20`, color }}>
      {icon}
    </div>
    <div className="stat-card__info">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { stats, subjectChartData, weeklyProductivity, completionDonut } = useProgress();
  const { revisionSchedules, subjects, updateRevision, deleteRevision } = useStudy();

  const upcomingRevisions = revisionSchedules
    .filter((r) => r.status !== 'Done')
    .sort((a, b) => new Date(a.revisionDate) - new Date(b.revisionDate))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <QuoteWidget />

      <div className="stats-grid">
        <StatCard icon={<MdTask />} label="Total Tasks" value={stats.total} color="#6c5ce7" delay={0} />
        <StatCard icon={<MdCheckCircle />} label="Completed" value={stats.completed} color="#2ed573" delay={0.1} />
        <StatCard icon={<MdPending />} label="Pending" value={stats.pending} color="#ffa502" delay={0.2} />
        <StatCard icon={<MdWarning />} label="Overdue" value={stats.overdue} color="#ff4757" delay={0.3} />
        <StatCard icon={<MdEventRepeat />} label="Revision" value={stats.revision} color="#3742fa" delay={0.4} />
      </div>

      <div className="dashboard__charts">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="chart-card__title">Subject Progress</h3>
          <SubjectProgressChart data={subjectChartData} />
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="chart-card__title">Completion Rate</h3>
          <CompletionDonut data={completionDonut} />
        </motion.div>
      </div>

      <motion.div
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="chart-card__title">Weekly Productivity</h3>
        <WeeklyChart data={weeklyProductivity} />
      </motion.div>

      {upcomingRevisions.length > 0 && (
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="chart-card__title">📅 Upcoming Revisions</h3>
          <RevisionList
            revisions={upcomingRevisions}
            subjects={subjects}
            onComplete={(id) => updateRevision(id, { status: 'Done' })}
            onDelete={deleteRevision}
          />
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
