import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdClose, MdTask } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useTasks from '../hooks/useTasks';
import { useStudy } from '../context/StudyContext';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import useDebounce from '../hooks/useDebounce';

const taskSchema = yup.object({
  title: yup.string().required('Task title is required'),
  subject: yup.string().required('Select a subject'),
  topic: yup.string(),
  deadline: yup.string(),
  priority: yup.string().required('Select priority'),
});

const tabs = ['All', 'Pending', 'Completed', 'Overdue', 'Revision'];

const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, getFilteredTasks, taskCounts } = useTasks();
  const { subjects } = useStudy();

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ subject: '', priority: '', status: '', sort: 'deadline' });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const debouncedSearch = useDebounce(search);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(taskSchema) });

  const filteredTasks = getFilteredTasks({
    tab: activeTab,
    search: debouncedSearch,
    subjectFilter: filters.subject,
    priorityFilter: filters.priority,
    statusFilter: filters.status,
    sort: filters.sort,
  });

  const openAdd = () => {
    setEditingTask(null);
    reset({ title: '', subject: '', topic: '', deadline: '', priority: '' });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      subject: task.subject,
      topic: task.topic || '',
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      priority: task.priority,
    });
    setShowModal(true);
  };

  const onSubmit = (data) => {
    const taskData = {
      ...data,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast.success('Task updated!');
    } else {
      addTask(taskData);
      toast.success('Task added!');
    }
    setShowModal(false);
    reset();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      deleteTask(id);
      toast.info('Task deleted');
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'All': return taskCounts.total;
      case 'Pending': return taskCounts.pending;
      case 'Completed': return taskCounts.completed;
      case 'Overdue': return taskCounts.overdue;
      case 'Revision': return taskCounts.revision;
      default: return 0;
    }
  };

  return (
    <div className="tasks-page">
      <div className="page-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
        <button className="btn btn--primary" onClick={openAdd}>
          <MdAdd /> Add Task
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className="tab__count">{getTabCount(tab)}</span>
          </button>
        ))}
      </div>

      <FilterBar subjects={subjects} filters={filters} onFilterChange={setFilters} />

      {/* Task list */}
      <div className="task-list">
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <MdTask className="empty-state__icon" />
              <h3>No Tasks Found</h3>
              <p>Create a task or adjust your filters.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                subjectName={subjects.find((s) => s.id === task.subject)?.name}
                onToggle={toggleTaskStatus}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal__header">
                <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
                <button className="icon-btn" onClick={() => setShowModal(false)}>
                  <MdClose />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal__body">
                  <div className="form-group">
                    <label className="form-label">Task Title *</label>
                    <input className="form-input" {...register('title')} placeholder="e.g. Solve 10 binary tree problems" />
                    {errors.title && <span className="form-error">{errors.title.message}</span>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <select className="form-input" {...register('subject')}>
                        <option value="">Select subject</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      {errors.subject && <span className="form-error">{errors.subject.message}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Topic</label>
                      <input className="form-input" {...register('topic')} placeholder="e.g. Binary Trees" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Deadline</label>
                      <input type="date" className="form-input" {...register('deadline')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Priority *</label>
                      <select className="form-input" {...register('priority')}>
                        <option value="">Select priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      {errors.priority && <span className="form-error">{errors.priority.message}</span>}
                    </div>
                  </div>
                </div>
                <div className="modal__footer">
                  <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn--primary">{editingTask ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
