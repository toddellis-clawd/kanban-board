import { useEffect, useRef } from 'react';

export default function Modal({ title, onClose, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
    >
      <div
        className="w-full max-w-md rounded-xl shadow-2xl"
        style={{ backgroundColor: '#1a1d27', border: '1px solid #2e3349' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #2e3349' }}
        >
          <h2 className="text-base font-semibold" style={{ color: '#e8eaf0' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md text-lg leading-none transition-colors"
            style={{ color: '#8b90a7' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#272b3d';
              e.currentTarget.style.color = '#e8eaf0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8b90a7';
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
