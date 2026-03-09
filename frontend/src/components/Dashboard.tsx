import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalWords: 0,
    masteredWords: 0,
    streak: 0,
    xp: 0,
  });
  const [badges] = useState<string[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await api.getProgress('hailey');
        setStats({
          totalWords: progress.total_words || 0,
          masteredWords: progress.mastered_words || 0,
          streak: 0,
          xp: progress.total_words * 10 || 0,
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h2 style={{ 
        color: 'white', 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '28px'
      }}>
        🎉 Your Progress
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard label="Words Learned" value={stats.totalWords} emoji="📚" />
        <StatCard label="Mastered" value={stats.masteredWords} emoji="⭐" />
        <StatCard label="XP" value={stats.xp} emoji="✨" />
        <StatCard label="Level" value={Math.floor(stats.xp / 100) + 1} emoji="🎯" />
      </div>

      {badges.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '16px' }}>🏆 Badges</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {badges.map((badge, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '20px',
                  fontWeight: 'bold'
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; emoji: string }> = ({ label, value, emoji }) => (
  <div style={{
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  }}>
    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{emoji}</div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{value}</div>
    <div style={{ color: '#888', fontSize: '14px', marginTop: '4px' }}>{label}</div>
  </div>
);
