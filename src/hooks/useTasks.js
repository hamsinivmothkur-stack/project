import { useMemo, useCallback } from 'react';
import { useStudy } from '../context/StudyContext';
import { isOverdue } from '../utils/helpers';

const useTasks = () => {
  const { tasks, addTask, updateTask, deleteTask, subjects } = useStudy();

  const toggleTaskStatus = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
      updateTask(id, { status: newStatus });
    },
    [tasks, updateTask]
  );

  const getFilteredTasks = useCallback(
    ({ tab = 'All', search = '', subjectFilter = '', priorityFilter = '', statusFilter = '', sort = 'deadline' }) => {
      let filtered = [...tasks];

      // Tab filter
      switch (tab) {
        case 'Pending':
          filtered = filtered.filter((t) => t.status === 'Pending');
          break;
        case 'Completed':
          filtered = filtered.filter((t) => t.status === 'Completed');
          break;
        case 'Overdue':
          filtered = filtered.filter((t) => t.status !== 'Completed' && isOverdue(t.deadline));
          break;
        case 'Revision':
          filtered = filtered.filter((t) => t.status === 'Revision');
          break;
        default:
          break;
      }

      // Search
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title?.toLowerCase().includes(q) ||
            t.topic?.toLowerCase().includes(q) ||
            subjects.find((s) => s.id === t.subject)?.name?.toLowerCase().includes(q)
        );
      }

      // Filters
      if (subjectFilter) filtered = filtered.filter((t) => t.subject === subjectFilter);
      if (priorityFilter) filtered = filtered.filter((t) => t.priority === priorityFilter);
      if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter);

      // Sort
      switch (sort) {
        case 'deadline':
          filtered.sort((a, b) => new Date(a.deadline || '9999') - new Date(b.deadline || '9999'));
          break;
        case 'priority': {
          const order = { High: 0, Medium: 1, Low: 2 };
          filtered.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
          break;
        }
        case 'subject':
          filtered.sort((a, b) => {
            const nameA = subjects.find((s) => s.id === a.subject)?.name || '';
            const nameB = subjects.find((s) => s.id === b.subject)?.name || '';
            return nameA.localeCompare(nameB);
          });
          break;
        default:
          break;
      }

      return filtered;
    },
    [tasks, subjects]
  );

  const taskCounts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const overdue = tasks.filter((t) => t.status !== 'Completed' && isOverdue(t.deadline)).length;
    const revision = tasks.filter((t) => t.status === 'Revision').length;
    return { total, completed, pending, overdue, revision };
  }, [tasks]);

  return { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, getFilteredTasks, taskCounts };
};

export default useTasks;
