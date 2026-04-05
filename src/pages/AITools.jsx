import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdAutoAwesome, MdQuiz, MdStyle, MdSend, MdKey } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useStudy } from '../context/StudyContext';
import { generateSummary, generateQuestions, generateFlashcards } from '../services/aiService';

const modes = [
  { id: 'summary', label: 'Summary', icon: <MdAutoAwesome />, description: 'Generate a comprehensive topic summary' },
  { id: 'questions', label: 'Practice Questions', icon: <MdQuiz />, description: 'Generate practice questions with answers' },
  { id: 'flashcards', label: 'Flashcards', icon: <MdStyle />, description: 'Generate study flashcards' },
];

const AITools = () => {
  const { aiApiKey, setAiApiKey } = useStudy();
  const [selectedMode, setSelectedMode] = useState('summary');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const handleGenerate = async () => {
    if (!aiApiKey) {
      toast.error('Please set your Gemini API key first!');
      setShowKeyInput(true);
      return;
    }

    if (!prompt.trim()) {
      toast.warning('Please enter a topic or prompt');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      let response;
      switch (selectedMode) {
        case 'summary':
          response = await generateSummary(prompt, aiApiKey);
          break;
        case 'questions':
          response = await generateQuestions(prompt, aiApiKey);
          break;
        case 'flashcards':
          response = await generateFlashcards(prompt, aiApiKey);
          break;
        default:
          break;
      }
      setResult(response);
      toast.success('Generated successfully!');
    } catch (error) {
      toast.error(error.message);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    setAiApiKey(tempKey);
    setShowKeyInput(false);
    toast.success('API key saved!');
  };

  return (
    <div className="ai-page">
      {/* API Key Banner */}
      {!aiApiKey && (
        <motion.div
          className="ai-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MdKey className="ai-banner__icon" />
          <div>
            <h4>API Key Required</h4>
            <p>Get a free key at <b>aistudio.google.com/apikey</b></p>
          </div>
          <button className="btn btn--primary btn--sm" onClick={() => setShowKeyInput(!showKeyInput)}>
            Set API Key
          </button>
        </motion.div>
      )}

      {showKeyInput && (
        <motion.div
          className="ai-key-input"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <input
            type="password"
            className="form-input"
            placeholder="AIza..."
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
          />
          <button className="btn btn--primary" onClick={handleSaveKey}>Save Key</button>
        </motion.div>
      )}

      {/* Mode Selector */}
      <div className="ai-modes">
        {modes.map((mode) => (
          <motion.button
            key={mode.id}
            className={`ai-mode-card ${selectedMode === mode.id ? 'ai-mode-card--active' : ''}`}
            onClick={() => setSelectedMode(mode.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="ai-mode-card__icon">{mode.icon}</span>
            <span className="ai-mode-card__label">{mode.label}</span>
            <span className="ai-mode-card__desc">{mode.description}</span>
          </motion.button>
        ))}
      </div>

      {/* Input */}
      <div className="ai-input-section">
        <div className="ai-input-wrapper">
          <textarea
            className="ai-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Enter a topic for ${modes.find((m) => m.id === selectedMode)?.label}...\ne.g. Binary Search Trees, Dynamic Programming, Graph Algorithms`}
            rows={3}
          />
          <button
            className="ai-send-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <MdSend />
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {(result || loading) && (
        <motion.div
          className="ai-result chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="chart-card__title">
            {modes.find((m) => m.id === selectedMode)?.icon}{' '}
            {modes.find((m) => m.id === selectedMode)?.label} Result
          </h3>
          {loading ? (
            <div className="ai-loading">
              <div className="spinner-lg" />
              <p>Generating with AI... This may take a few seconds.</p>
            </div>
          ) : (
            <div className="ai-result__content">
              {result.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h4 key={i} className="ai-result__heading">{line.replace(/\*\*/g, '')}</h4>;
                }
                if (line.startsWith('- ') || line.startsWith('• ')) {
                  return <li key={i} className="ai-result__bullet">{line.substring(2)}</li>;
                }
                if (line.trim() === '') return <br key={i} />;
                return <p key={i}>{line}</p>;
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AITools;
