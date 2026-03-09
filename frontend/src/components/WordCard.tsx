import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import { StrokeViewer } from './StrokeViewer';

interface WordCardProps {
  character: string;
  onLearned: () => void;
}

interface WordData {
  character: string;
  pinyin: string;
  translation: string;
  examples: string[];
  found: boolean;
  svg?: string;
}

export const WordCard: React.FC<WordCardProps> = ({ character, onLearned }) => {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        const [dictData, strokeData, imageData] = await Promise.all([
          api.getDictionary(character),
          api.getStrokeOrder(character),
          api.getAIImage(character)
        ]);

        setWordData({
          ...dictData,
          svg: strokeData.svg,
        });
        setImageUrl(imageData.image_url);
      } catch (error) {
        console.error('Error fetching word data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWordData();
  }, [character]);

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        background: 'white',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px' }}>Loading...</div>
      </div>
    );
  }

  if (!wordData) {
    return null;
  }

  const handleMarkLearned = async () => {
    try {
      await api.markWordLearned('hailey', character, wordData.pinyin, wordData.translation);
      onLearned();
    } catch (error) {
      console.error('Error marking word as learned:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '80px', fontWeight: 'bold', color: '#667eea' }}>
          {character}
        </div>
        <div style={{ fontSize: '24px', color: '#764ba2', marginTop: '8px' }}>
          {wordData.pinyin}
        </div>
        <div style={{ fontSize: '20px', color: '#333', marginTop: '8px' }}>
          {wordData.translation}
        </div>
      </div>

      {imageUrl && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={imageUrl}
            alt={character}
            style={{
              maxWidth: '200px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      )}

      {wordData.svg && (
        <StrokeViewer svg={wordData.svg} character={character} />
      )}

      {wordData.examples && wordData.examples.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#667eea', marginBottom: '10px' }}>Examples</h4>
          {wordData.examples.slice(0, 3).map((example, index) => (
            <div key={index} style={{ 
              padding: '8px', 
              background: '#f5f5f5', 
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              {example}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleMarkLearned}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        ✓ I Learned This!
      </button>
    </motion.div>
  );
};
