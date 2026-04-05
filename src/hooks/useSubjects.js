import { useMemo, useCallback } from 'react';
import { useStudy } from '../context/StudyContext';

const useSubjects = () => {
  const { subjects, topics, addSubject, updateSubject, deleteSubject, addTopic, updateTopic, deleteTopic } = useStudy();

  const getTopicsForSubject = useCallback(
    (subjectId) => topics.filter((t) => t.subjectId === subjectId),
    [topics]
  );

  const subjectProgress = useMemo(() => {
    return subjects.map((subject) => {
      const subTopics = topics.filter((t) => t.subjectId === subject.id);
      const total = subTopics.length;
      const completed = subTopics.filter((t) => t.status === 'Completed').length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...subject, total, completed, percentage };
    });
  }, [subjects, topics]);

  const searchTopics = useCallback(
    (query) => {
      if (!query) return [];
      const q = query.toLowerCase();
      return topics.filter(
        (t) => t.name?.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q)
      );
    },
    [topics]
  );

  return {
    subjects, topics,
    addSubject, updateSubject, deleteSubject,
    addTopic, updateTopic, deleteTopic,
    getTopicsForSubject, subjectProgress, searchTopics,
  };
};

export default useSubjects;
