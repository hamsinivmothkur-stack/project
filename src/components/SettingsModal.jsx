import { useState } from 'react';
import { MdClose, MdKey } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { aiApiKey, setAiApiKey } = useStudy();
  const [key, setKey] = useState(aiApiKey);

  const handleSave = () => {
    setAiApiKey(key);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h2>Settings</h2>
              <button className="icon-btn" onClick={onClose}>
                <MdClose />
              </button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label className="form-label">
                  <MdKey /> Gemini API Key
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="AIza..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                <p className="form-hint">
                  Get your free key at aistudio.google.com/apikey — stored locally, never shared.
                </p>
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn--primary" onClick={handleSave}>Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
