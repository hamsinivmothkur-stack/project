import { useState, useEffect } from 'react';
import { fallbackQuotes } from '../utils/helpers';
import { fetchQuote } from '../services/aiService';

const QuoteWidget = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const loadQuote = async () => {
      const fetched = await fetchQuote();
      if (fetched) {
        setQuote(fetched);
      } else {
        const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setQuote(random);
      }
    };
    loadQuote();
  }, []);

  if (!quote) return null;

  return (
    <div className="quote-widget">
      <p className="quote-widget__text">"{quote.content}"</p>
      <p className="quote-widget__author">— {quote.author}</p>
    </div>
  );
};

export default QuoteWidget;
