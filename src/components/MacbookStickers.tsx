import React from 'react';
import StickerDrag from './StickerDrag';

import sticker1 from '../assets/image-1-stricker.png';
import sticker2 from '../assets/image-2-stricker.png';
import sticker3 from '../assets/image-3-stricker.png';
import sticker4 from '../assets/image-4-stricker.png';
import sticker6 from '../assets/image-6-stricker.png';
import sticker7 from '../assets/image-7-stricker.png';
import sticker8 from '../assets/image-8-stricker.png';

const MacbookStickers = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '800px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#0a0a0a'
    }}>
      {/* MacBook Lid */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        aspectRatio: '16/10',
        backgroundColor: '#444648',
        borderRadius: '32px',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
        {/* Apple Logo placeholder */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          opacity: 0.8,
          pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 512 512" fill="#222">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
          </svg>
        </div>

        {/* Example Stickers using StickerDrag */}
        <div style={{ position: 'absolute', top: '15%', left: '15%', width: '180px', height: '180px' }}>
          <StickerDrag image={sticker1} />
        </div>
        <div style={{ position: 'absolute', top: '10%', right: '25%', width: '210px', height: '210px' }}>
          <StickerDrag image={sticker2} />
        </div>
        <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '170px', height: '170px' }}>
          <StickerDrag image={sticker3} />
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: '190px', height: '190px' }}>
          <StickerDrag image={sticker4} />
        </div>
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '175px', height: '175px' }}>
          <StickerDrag image={sticker6} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '8%', width: '165px', height: '165px' }}>
          <StickerDrag image={sticker7} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: '45%', width: '185px', height: '185px' }}>
          <StickerDrag image={sticker8} />
        </div>
        
      </div>
    </div>
  );
};

export default MacbookStickers;
