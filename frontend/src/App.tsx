import React, { useState } from 'react';
import { DrawingCanvas } from './components/DrawingCanvas';
import { WordCard } from './components/WordCard';
import { BaoBaoChat } from './components/BaoBaoChat';
import { Dashboard } from './components/Dashboard';

type Tab = 'learn' | 'chat' | 'progress';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);

  const handleDrawingComplete = async (drawingData: string) => {
    setCurrentCharacter(drawingData.substring(0, 10));
  };

  const handleWordLearned = () => {
    setCurrentCharacter(null);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>
          🐼 Learn Chinese with Bao Bao Panda
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Draw characters and learn Chinese the fun way!
        </p>
      </header>

      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '30px'
      }}>
        <TabButton 
          active={activeTab === 'learn'} 
          onClick={() => setActiveTab('learn')}
          label="Learn"
          emoji="📖"
        />
        <TabButton 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')}
          label="Chat"
          emoji="💬"
        />
        <TabButton 
          active={activeTab === 'progress'} 
          onClick={() => setActiveTab('progress')}
          label="Progress"
          emoji="🏆"
        />
      </nav>

      <main>
        {activeTab === 'learn' && (
          <>
            {!currentCharacter ? (
              <DrawingCanvas onDrawingComplete={handleDrawingComplete} />
            ) : (
              <WordCard character={currentCharacter} onLearned={handleWordLearned} />
            )}
          </>
        )}

        {activeTab === 'chat' && <BaoBaoChat />}
        {activeTab === 'progress' && <Dashboard />}
      </main>
    </div>
  );
}

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
}> = ({ active, onClick, label, emoji }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 24px',
      background: active 
        ? 'white' 
        : 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '24px',
      color: active ? '#667eea' : 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    }}
  >
    {emoji} {label}
  </button>
);

export default App;
