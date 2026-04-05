import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdClose, MdMenuBook } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useSubjects from '../hooks/useSubjects';
import SubjectCard from '../components/SubjectCard';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';
import { subjectColors } from '../utils/helpers';

const subjectSchema = yup.object({
  name: yup.string().required('Subject name is required'),
  description: yup.string(),
  color: yup.string().required(),
});

const topicSchema = yup.object({
  name: yup.string().required('Topic name is required'),
  difficulty: yup.string().required('Select difficulty'),
  notes: yup.string(),
});

const Subjects = () => {
  const {
    subjects, addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic, getTopicsForSubject
  } = useSubjects();

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const {
    register: registerSubject,
    handleSubmit: handleSubjectSubmit,
    reset: resetSubject,
    setValue: setSubjectValue,
    watch: watchSubject,
    formState: { errors: subjectErrors },
  } = useForm({ resolver: yupResolver(subjectSchema), defaultValues: { color: subjectColors[0] } });

  const {
    register: registerTopic,
    handleSubmit: handleTopicSubmit,
    reset: resetTopic,
    formState: { errors: topicErrors },
  } = useForm({ resolver: yupResolver(topicSchema) });

  const selectedColor = watchSubject('color');

  // Subject CRUD
  const openAddSubject = () => {
    setEditingSubject(null);
    resetSubject({ name: '', description: '', color: subjectColors[0] });
    setShowSubjectModal(true);
  };

  const openEditSubject = (subject) => {
    setEditingSubject(subject);
    resetSubject({ name: subject.name, description: subject.description, color: subject.color });
    setShowSubjectModal(true);
  };

  const onSubjectSubmit = (data) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
      toast.success('Subject updated!');
    } else {
      addSubject(data);
      toast.success('Subject added!');
    }
    setShowSubjectModal(false);
    resetSubject();
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm('Delete this subject and all its topics?')) {
      deleteSubject(id);
      toast.info('Subject deleted');
    }
  };

  // Topic CRUD
  const openAddTopic = (subjectId) => {
    setActiveSubjectId(subjectId);
    setEditingTopic(null);
    resetTopic({ name: '', difficulty: '', notes: '' });
    setShowTopicModal(true);
  };

  const openEditTopic = (topic) => {
    setActiveSubjectId(topic.subjectId);
    setEditingTopic(topic);
    resetTopic({ name: topic.name, difficulty: topic.difficulty, notes: topic.notes || '' });
    setShowTopicModal(true);
  };

  const onTopicSubmit = (data) => {
    if (editingTopic) {
      updateTopic(editingTopic.id, data);
      toast.success('Topic updated!');
    } else {
      addTopic({ ...data, subjectId: activeSubjectId, status: 'Not Started' });
      toast.success('Topic added!');
    }
    setShowTopicModal(false);
    resetTopic();
  };

  const handleTopicStatusChange = (topic) => {
    const statuses = ['Not Started', 'In Progress', 'Completed', 'Needs Revision'];
    const currentIdx = statuses.indexOf(topic.status);
    const nextIdx = (currentIdx + 1) % statuses.length;
    updateTopic(topic.id, { status: statuses[nextIdx] });
    toast.info(`Topic marked as "${statuses[nextIdx]}"`);
  };

  // Filter subjects by search
  const filteredSubjects = debouncedSearch
    ? subjects.filter(
        (s) =>
          s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          s.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : subjects;

  return (
    <div className="subjects-page">
      <div className="page-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search subjects..." />
        <button className="btn btn--primary" onClick={openAddSubject}>
          <MdAdd /> Add Subject
        </button>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="empty-state">
          <MdMenuBook className="empty-state__icon" />
          <h3>No Subjects Yet</h3>
          <p>Create your first subject to get started!</p>
          <button className="btn btn--primary" onClick={openAddSubject}>
            <MdAdd /> Add Subject
          </button>
        </div>
      ) : (
        <div className="subjects-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              topics={getTopicsForSubject(subject.id)}
              onEdit={openEditSubject}
              onDelete={handleDeleteSubject}
              onTopicClick={handleTopicStatusChange}
              onAddTopic={openAddTopic}
            />
          ))}
        </div>
      )}

      {/* Subject Modal */}
      <AnimatePresence>
        {showSubjectModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSubjectModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal__header">
                <h2>{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
                <button className="icon-btn" onClick={() => setShowSubjectModal(false)}>
                  <MdClose />
                </button>
              </div>
              <form onSubmit={handleSubjectSubmit(onSubjectSubmit)}>
                <div className="modal__body">
                  <div className="form-group">
                    <label className="form-label">Subject Name *</label>
                    <input className="form-input" {...registerSubject('name')} placeholder="e.g. Mathematics" />
                    {subjectErrors.name && <span className="form-error">{subjectErrors.name.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-input form-textarea" {...registerSubject('description')} placeholder="Brief description..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Color</label>
                    <div className="color-picker">
                      {subjectColors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`color-swatch ${selectedColor === c ? 'color-swatch--active' : ''}`}
                          style={{ background: c }}
                          onClick={() => setSubjectValue('color', c)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal__footer">
                  <button type="button" className="btn btn--ghost" onClick={() => setShowSubjectModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn--primary">{editingSubject ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topic Modal */}
      <AnimatePresence>
        {showTopicModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTopicModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal__header">
                <h2>{editingTopic ? 'Edit Topic' : 'Add Topic'}</h2>
                <button className="icon-btn" onClick={() => setShowTopicModal(false)}>
                  <MdClose />
                </button>
              </div>
              <form onSubmit={handleTopicSubmit(onTopicSubmit)}>
                <div className="modal__body">
                  <div className="form-group">
                    <label className="form-label">Topic Name *</label>
                    <input className="form-input" {...registerTopic('name')} placeholder="e.g. Binary Trees" />
                    {topicErrors.name && <span className="form-error">{topicErrors.name.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty *</label>
                    <select className="form-input" {...registerTopic('difficulty')}>
                      <option value="">Select difficulty</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    {topicErrors.difficulty && <span className="form-error">{topicErrors.difficulty.message}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-input form-textarea" {...registerTopic('notes')} placeholder="Add notes..." />
                  </div>
                </div>
                <div className="modal__footer">
                  <button type="button" className="btn btn--ghost" onClick={() => setShowTopicModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn--primary">{editingTopic ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Subjects;
