import axios from 'axios';

const API_BASE = '/api';

export const api = {
  recognizeHandwriting: async (drawingData: string) => {
    const response = await axios.post(`${API_BASE}/handwriting`, { drawing_data: drawingData });
    return response.data;
  },

  getDictionary: async (character: string) => {
    const response = await axios.get(`${API_BASE}/dictionary/${encodeURIComponent(character)}`);
    return response.data;
  },

  getStrokeOrder: async (character: string) => {
    const response = await axios.get(`${API_BASE}/strokes/${encodeURIComponent(character)}`);
    return response.data;
  },

  getAIImage: async (word: string) => {
    const response = await axios.get(`${API_BASE}/image/${encodeURIComponent(word)}`);
    return response.data;
  },

  markWordLearned: async (userId: string, character: string, pinyin: string, translation: string) => {
    const response = await axios.post(`${API_BASE}/progress/learn`, {
      user_id: userId,
      character,
      pinyin,
      translation,
    });
    return response.data;
  },

  getProgress: async (userId: string) => {
    const response = await axios.get(`${API_BASE}/progress?user_id=${encodeURIComponent(userId)}`);
    return response.data;
  },

  chatWithBaoBao: async (userId: string, message: string) => {
    const response = await axios.post(`${API_BASE}/bao-bao/chat`, {
      user_id: userId,
      message,
    });
    return response.data;
  },
};
