import React from 'react';

interface StrokeViewerProps {
  svg: string;
  character: string;
}

export const StrokeViewer: React.FC<StrokeViewerProps> = ({ svg, character }) => {
  if (!svg) {
    return (
      <div style={{
        padding: '20px',
        background: 'white',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#667eea', margin: '0 0 10px 0' }}>Stroke Order</h3>
        <div style={{ fontSize: '80px', color: '#333' }}>{character}</div>
        <p style={{ color: '#888' }}>Stroke animation not available</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      borderRadius: '16px',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#667eea', margin: '0 0 10px 0' }}>Stroke Order</h3>
      <div 
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ 
          maxWidth: '200px', 
          margin: '0 auto'
        }}
      />
    </div>
  );
};
