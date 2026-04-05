import { createContext, useContext, useState, useEffect } from 'react';
import { generateId, getRevisionDate } from '../utils/helpers';

const StudyContext = createContext();

const STORAGE_KEY = 'ai-study-companion-data';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const StudyProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [revisionSchedules, setRevisionSchedules] = useState([]);
  const [aiApiKey, setAiApiKey] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setSubjects(stored.subjects || []);
      setTopics(stored.topics || []);
      setTasks(stored.tasks || []);
      setRevisionSchedules(stored.revisionSchedules || []);
      setAiApiKey(stored.aiApiKey || '');
    }
    setInitialized(true);
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!initialized) return;
    saveToStorage({ subjects, topics, tasks, revisionSchedules, aiApiKey });
  }, [subjects, topics, tasks, revisionSchedules, aiApiKey, initialized]);

  // ---- SUBJECTS ----
  const addSubject = (subject) => {
    const newSubject = { ...subject, id: generateId() };
    setSubjects((prev) => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = (id, updates) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setTopics((prev) => prev.filter((t) => t.subjectId !== id));
    setTasks((prev) => prev.filter((t) => t.subject !== id));
  };

  // ---- TOPICS ----
  const addTopic = (topic) => {
    const newTopic = { ...topic, id: generateId(), status: topic.status || 'Not Started' };
    setTopics((prev) => [...prev, newTopic]);
    return newTopic;
  };

  const updateTopic = (id, updates) => {
    setTopics((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      // If marked as Completed, auto-create revision schedule
      const topic = updated.find((t) => t.id === id);
      if (updates.status === 'Completed' && topic) {
        const revDate = getRevisionDate(new Date());
        const existingRevision = revisionSchedules.find((r) => r.topicId === id);
        if (!existingRevision) {
          setRevisionSchedules((prev) => [
            ...prev,
            {
              id: generateId(),
              topicId: id,
              topicName: topic.name,
              subjectId: topic.subjectId,
              revisionDate: revDate.toISOString(),
              status: 'Pending',
              completedDate: new Date().toISOString(),
            },
          ]);
        }
      }
      return updated;
    });
  };

  const deleteTopic = (id) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
    setRevisionSchedules((prev) => prev.filter((r) => r.topicId !== id));
  };

  // ---- TASKS ----
  const addTask = (task) => {
    const newTask = { ...task, id: generateId(), status: task.status || 'Pending', createdAt: new Date().toISOString() };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'Completed' && !t.completedAt) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ---- REVISIONS ----
  const updateRevision = (id, updates) => {
    setRevisionSchedules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRevision = (id) => {
    setRevisionSchedules((prev) => prev.filter((r) => r.id !== id));
  };

  const value = {
    subjects, topics, tasks, revisionSchedules, aiApiKey,
    addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic,
    addTask, updateTask, deleteTask,
    updateRevision, deleteRevision,
    setAiApiKey,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within StudyProvider');
  return context;
};

export default StudyContext;
