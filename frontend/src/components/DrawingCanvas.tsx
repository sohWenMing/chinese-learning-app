import React, { useRef } from 'react';
import { useDrawing } from '../hooks/useDrawing';

interface DrawingCanvasProps {
  onDrawingComplete: (drawingData: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { handlePointerDown, handlePointerMove, handlePointerUp, clear, getDrawingData } = useDrawing(canvasRef);

  const handleSubmit = () => {
    const data = getDrawingData();
    if (data) {
      onDrawingComplete(data);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#667eea', margin: 0 }}>Draw a Chinese Character</h2>
      <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Use your finger or stylus to draw</p>
      
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          border: '3px dashed #667eea',
          borderRadius: '12px',
          cursor: 'crosshair',
          touchAction: 'none',
          background: '#fafafa'
        }}
      />

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={clear}
          style={{
            padding: '12px 24px',
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white'
          }}
        >
          What's this?
        </button>
      </div>
    </div>
  );
};
