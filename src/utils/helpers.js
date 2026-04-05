import { format, isPast, isToday, addDays, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// Generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

// Format date short
export const formatDateShort = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd');
};

// Check if a task is overdue
export const isOverdue = (deadline) => {
  if (!deadline) return false;
  return isPast(new Date(deadline)) && !isToday(new Date(deadline));
};

// Check if date is today
export const isDateToday = (date) => {
  if (!date) return false;
  return isToday(new Date(date));
};

// Get revision date (completion date + 3 days)
export const getRevisionDate = (completionDate) => {
  if (!completionDate) return null;
  return addDays(new Date(completionDate), 3);
};

// Get days until deadline
export const getDaysUntil = (date) => {
  if (!date) return null;
  return differenceInDays(new Date(date), new Date());
};

// Get this week's date range
export const getThisWeekRange = () => {
  const now = new Date();
  return {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  };
};

// Get days of this week
export const getWeekDays = () => {
  const { start, end } = getThisWeekRange();
  return eachDayOfInterval({ start, end });
};

// Priority color mapping
export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high': return '#ff4757';
    case 'medium': return '#ffa502';
    case 'low': return '#2ed573';
    default: return '#a4b0be';
  }
};

// Status color mapping
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed': return '#2ed573';
    case 'in progress': return '#3742fa';
    case 'not started': return '#a4b0be';
    case 'needs revision': return '#ffa502';
    case 'pending': return '#eccc68';
    case 'overdue': return '#ff4757';
    default: return '#a4b0be';
  }
};

// Default subjects for initial data
export const defaultSubjects = [
  { id: generateId(), name: 'Mathematics', description: 'Algebra, Calculus, Statistics', color: '#6c5ce7' },
  { id: generateId(), name: 'Computer Science', description: 'Programming, OS, Networks', color: '#0984e3' },
  { id: generateId(), name: 'Data Structures', description: 'Arrays, Trees, Graphs', color: '#00b894' },
];

// Fallback motivational quotes
export const fallbackQuotes = [
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { content: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { content: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { content: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { content: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { content: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" },
  { content: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
];

// Subject color palette
export const subjectColors = [
  '#6c5ce7', '#0984e3', '#00b894', '#e17055',
  '#fdcb6e', '#e84393', '#00cec9', '#636e72',
  '#a29bfe', '#74b9ff', '#55efc4', '#fab1a0',
];
