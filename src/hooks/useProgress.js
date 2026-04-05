import { useMemo } from 'react';
import { useStudy } from '../context/StudyContext';
import { isOverdue, getWeekDays } from '../utils/helpers';
import { format, isSameDay } from 'date-fns';

const useProgress = () => {
  const { subjects, topics, tasks } = useStudy();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const overdue = tasks.filter((t) => t.status !== 'Completed' && isOverdue(t.deadline)).length;
    const revision = tasks.filter((t) => t.status === 'Revision').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, revision, completionRate };
  }, [tasks]);

  const subjectChartData = useMemo(() => {
    return subjects.map((subject) => {
      const subTopics = topics.filter((t) => t.subjectId === subject.id);
      const total = subTopics.length;
      const completed = subTopics.filter((t) => t.status === 'Completed').length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: subject.name,
        completed,
        total,
        percentage,
        color: subject.color,
      };
    });
  }, [subjects, topics]);

  const weeklyProductivity = useMemo(() => {
    const weekDays = getWeekDays();
    return weekDays.map((day) => {
      const completedOnDay = tasks.filter(
        (t) => t.completedAt && isSameDay(new Date(t.completedAt), day)
      ).length;
      return {
        day: format(day, 'EEE'),
        date: format(day, 'MMM dd'),
        completed: completedOnDay,
      };
    });
  }, [tasks]);

  const completionDonut = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const remaining = tasks.length - completed;
    return [
      { name: 'Completed', value: completed, color: '#2ed573' },
      { name: 'Remaining', value: remaining, color: '#57606f' },
    ];
  }, [tasks]);

  return { stats, subjectChartData, weeklyProductivity, completionDonut };
};

export default useProgress;
