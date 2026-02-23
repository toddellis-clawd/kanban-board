import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';

const COLUMN_COLORS = [
  '#5b6aff', '#f5a623', '#3ecf8e', '#ff5263',
  '#a78bfa', '#06b6d4', '#f97316', '#ec4899',
];

export default function ColumnModal({ column, onSave, onClose }) {
  const [title, setTitle] = useState(column?.title || '');
  const [color, setColor] = useState(column?.color || COLUMN_COLORS[0]);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const isEditing = !!column;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({ title: trimmed, color });
  };

  const inputBase = {
    backgroundColor: '#0f1117',
    border: '1px solid #2e3349',
    color: '#e8eaf0',
    borderRadius: '8px',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    padding: '8px 12px',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
  };

  return (
    <Modal title={isEditing ? 'Rename Column' : 'Add Column'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: '#8b90a7' }}>
            Column Name <span style={{ color: '#ff5263' }}>*</span>
          </label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Column name…"
            style={inputBase}
            onFocus={e => (e.target.style.borderColor = '#5b6aff')}
            onBlur={e => (e.target.style.borderColor = '#2e3349')}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: '#8b90a7' }}>
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {COLUMN_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-transform"
                style={{
                  backgroundColor: c,
                  transform: color === c ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: color === c ? `0 0 0 2px #0f1117, 0 0 0 4px ${c}` : 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: '#8b90a7',
              border: '1px solid #2e3349',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#272b3d';
              e.currentTarget.style.color = '#e8eaf0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8b90a7';
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: title.trim() ? '#5b6aff' : '#2e3349',
              color: title.trim() ? '#fff' : '#555c75',
              border: 'none',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={e => {
              if (title.trim()) e.currentTarget.style.backgroundColor = '#6e7cff';
            }}
            onMouseLeave={e => {
              if (title.trim()) e.currentTarget.style.backgroundColor = '#5b6aff';
            }}
          >
            {isEditing ? 'Save Changes' : 'Add Column'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
