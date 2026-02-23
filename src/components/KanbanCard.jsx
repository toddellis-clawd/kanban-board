import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function KanbanCard({ card, index, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: snapshot.isDragging ? '#272b3d' : '#21253a',
            border: `1px solid ${snapshot.isDragging ? '#3e4565' : '#2e3349'}`,
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '8px',
            cursor: 'grab',
            boxShadow: snapshot.isDragging
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : hovered
              ? '0 2px 8px rgba(0,0,0,0.25)'
              : 'none',
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform} rotate(2deg)`
              : provided.draggableProps.style?.transform,
            transition: snapshot.isDragging ? undefined : 'box-shadow 0.15s, border-color 0.15s',
            userSelect: 'none',
            position: 'relative',
          }}
        >
          {/* Card header */}
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-sm font-medium leading-snug"
              style={{ color: '#e8eaf0', flex: 1 }}
            >
              {card.title}
            </span>
            {/* Menu button */}
            <div className="relative" style={{ flexShrink: 0 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                className="flex items-center justify-center w-6 h-6 rounded-md transition-colors text-lg leading-none"
                style={{
                  backgroundColor: menuOpen ? '#2e3349' : 'transparent',
                  color: '#8b90a7',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: hovered || menuOpen ? 1 : 0,
                  transition: 'opacity 0.15s, background-color 0.15s',
                  lineHeight: '14px',
                  fontSize: '18px',
                  paddingBottom: '3px',
                }}
              >
                ⋯
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 rounded-lg overflow-hidden z-10"
                  style={{
                    top: '28px',
                    minWidth: '130px',
                    backgroundColor: '#21253a',
                    border: '1px solid #2e3349',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(card); }}
                    className="w-full text-left px-3 py-2 text-sm transition-colors"
                    style={{ color: '#e8eaf0', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#272b3d')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(card.id); }}
                    className="w-full text-left px-3 py-2 text-sm transition-colors"
                    style={{ color: '#ff5263', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a1e24')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {card.description && (
            <p
              className="text-xs mt-2 leading-relaxed"
              style={{ color: '#8b90a7' }}
            >
              {card.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center mt-3" style={{ gap: '6px' }}>
            <span
              className="text-xs"
              style={{ color: '#555c75' }}
            >
              {formatDate(card.createdAt)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
