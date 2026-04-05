import axios from 'axios';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const makeRequest = async (prompt, apiKey) => {
  if (!apiKey) {
    throw new Error('Please set your Gemini API key in Settings.');
  }

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful study assistant. Provide clear, well-structured, and educational responses.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.7,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) throw new Error('Invalid request. Please try again.');
      if (status === 403) throw new Error('Invalid API key. Please check your settings.');
      if (status === 429) throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      if (status === 500) throw new Error('Server error. Please try again later.');
      throw new Error(`API error: ${error.response.data?.error?.message || 'Unknown error'}`);
    }
    throw new Error('Network error. Please check your connection.');
  }
};

export const generateSummary = async (topic, apiKey) => {
  const prompt = `Generate a comprehensive study summary for the topic: "${topic}". 
Include:
- Key concepts and definitions
- Important formulas or rules (if applicable)
- Real-world examples
- Common pitfalls to avoid
Format it in a clear, student-friendly way with bullet points and sections.`;
  return makeRequest(prompt, apiKey);
};

export const generateQuestions = async (topic, apiKey) => {
  const prompt = `Generate 8 practice questions for the topic: "${topic}". 
Include:
- 3 easy questions
- 3 medium questions  
- 2 hard questions
For each question, provide the answer below it.
Format clearly with question numbers and difficulty labels.`;
  return makeRequest(prompt, apiKey);
};

export const generateFlashcards = async (topic, apiKey) => {
  const prompt = `Generate 10 flashcards for the topic: "${topic}".
Format each flashcard as:
**Card [number]**
**Front:** [Question or term]
**Back:** [Answer or definition]

Make them concise and focused on key concepts.`;
  return makeRequest(prompt, apiKey);
};

export const fetchQuote = async () => {
  try {
    const response = await axios.get('https://api.quotable.io/random', { timeout: 3000 });
    return { content: response.data.content, author: response.data.author };
  } catch {
    return null;
  }
};
