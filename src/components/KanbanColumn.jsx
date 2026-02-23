import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onEditColumn,
  onDeleteColumn,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex flex-col rounded-xl"
      style={{
        backgroundColor: '#1a1d27',
        border: '1px solid #2e3349',
        width: '300px',
        minWidth: '300px',
        maxHeight: 'calc(100vh - 140px)',
        flexShrink: 0,
      }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #2e3349' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <span
            className="text-sm font-semibold truncate"
            style={{ color: '#e8eaf0' }}
          >
            {column.title}
          </span>
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded-md flex-shrink-0"
            style={{ backgroundColor: '#272b3d', color: '#8b90a7' }}
          >
            {cards.length}
          </span>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
            style={{
              backgroundColor: menuOpen ? '#272b3d' : 'transparent',
              color: '#8b90a7',
              border: 'none',
              cursor: 'pointer',
              opacity: hovered || menuOpen ? 1 : 0,
              transition: 'opacity 0.15s, background-color 0.15s',
              fontSize: '18px',
              paddingBottom: '3px',
            }}
          >
            ⋯
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 rounded-lg overflow-hidden z-20"
              style={{
                top: '32px',
                minWidth: '150px',
                backgroundColor: '#21253a',
                border: '1px solid #2e3349',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <button
                onClick={() => { setMenuOpen(false); onEditColumn(column); }}
                className="w-full text-left px-3 py-2 text-sm transition-colors"
                style={{ color: '#e8eaf0', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#272b3d')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                ✏️ Rename
              </button>
              <button
                onClick={() => { setMenuOpen(false); onAddCard(column.id); }}
                className="w-full text-left px-3 py-2 text-sm transition-colors"
                style={{ color: '#e8eaf0', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#272b3d')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                ＋ Add Card
              </button>
              <div style={{ height: '1px', backgroundColor: '#2e3349', margin: '4px 0' }} />
              <button
                onClick={() => { setMenuOpen(false); onDeleteColumn(column.id); }}
                className="w-full text-left px-3 py-2 text-sm transition-colors"
                style={{ color: '#ff5263', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a1e24')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                🗑 Delete Column
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards list */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto p-3"
            style={{
              minHeight: '60px',
              backgroundColor: snapshot.isDraggingOver
                ? 'rgba(91,106,255,0.05)'
                : 'transparent',
              transition: 'background-color 0.15s',
            }}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                onEdit={onEditCard}
                onDelete={(cardId) => onDeleteCard(column.id, cardId)}
              />
            ))}
            {provided.placeholder}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div
                className="flex items-center justify-center h-16 rounded-lg text-xs"
                style={{
                  border: '1px dashed #2e3349',
                  color: '#555c75',
                }}
              >
                Drop cards here
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add card button */}
      <div className="p-3 pt-0">
        <button
          onClick={() => onAddCard(column.id)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: 'transparent',
            color: '#8b90a7',
            border: '1px dashed #2e3349',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#272b3d';
            e.currentTarget.style.borderColor = '#3e4565';
            e.currentTarget.style.color = '#e8eaf0';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#2e3349';
            e.currentTarget.style.color = '#8b90a7';
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          Add card
        </button>
      </div>
    </div>
  );
}
