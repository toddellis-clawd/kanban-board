import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';

export default function CardModal({ card, onSave, onClose }) {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const isEditing = !!card;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({ title: trimmed, description: description.trim() });
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
    <Modal title={isEditing ? 'Edit Card' : 'Add Card'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: '#8b90a7' }}
          >
            Title <span style={{ color: '#ff5263' }}>*</span>
          </label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title…"
            style={inputBase}
            onFocus={e => (e.target.style.borderColor = '#5b6aff')}
            onBlur={e => (e.target.style.borderColor = '#2e3349')}
          />
        </div>
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: '#8b90a7' }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description…"
            rows={4}
            style={{ ...inputBase, resize: 'vertical', lineHeight: '1.5' }}
            onFocus={e => (e.target.style.borderColor = '#5b6aff')}
            onBlur={e => (e.target.style.borderColor = '#2e3349')}
          />
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
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
            {isEditing ? 'Save Changes' : 'Add Card'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
