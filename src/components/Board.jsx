import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import KanbanColumn from './KanbanColumn';
import CardModal from './CardModal';
import ColumnModal from './ColumnModal';
import ConfirmModal from './ConfirmModal';

export default function Board({ data, setData }) {
  const [cardModal, setCardModal] = useState(null);
  // { mode: 'add', columnId } | { mode: 'edit', columnId, card }

  const [columnModal, setColumnModal] = useState(null);
  // { mode: 'add' } | { mode: 'edit', column }

  const [confirmModal, setConfirmModal] = useState(null);
  // { type: 'card', columnId, cardId } | { type: 'column', columnId }

  // ── Drag & Drop ──────────────────────────────────────────────
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    setData((prev) => {
      const next = { ...prev, cards: { ...prev.cards } };

      const srcCards = [...(next.cards[source.droppableId] || [])];
      const [moved] = srcCards.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        srcCards.splice(destination.index, 0, moved);
        next.cards[source.droppableId] = srcCards;
      } else {
        const dstCards = [...(next.cards[destination.droppableId] || [])];
        dstCards.splice(destination.index, 0, moved);
        next.cards[source.droppableId] = srcCards;
        next.cards[destination.droppableId] = dstCards;
      }
      return next;
    });
  };

  // ── Cards ────────────────────────────────────────────────────
  const handleSaveCard = ({ title, description }) => {
    if (cardModal.mode === 'add') {
      const newCard = { id: uuidv4(), title, description, createdAt: Date.now() };
      setData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          [cardModal.columnId]: [...(prev.cards[cardModal.columnId] || []), newCard],
        },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          [cardModal.columnId]: prev.cards[cardModal.columnId].map((c) =>
            c.id === cardModal.card.id ? { ...c, title, description } : c
          ),
        },
      }));
    }
    setCardModal(null);
  };

  const handleEditCard = (columnId, card) => {
    setCardModal({ mode: 'edit', columnId, card });
  };

  const handleDeleteCard = (columnId, cardId) => {
    setConfirmModal({ type: 'card', columnId, cardId });
  };

  const confirmDeleteCard = () => {
    const { columnId, cardId } = confirmModal;
    setData((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [columnId]: prev.cards[columnId].filter((c) => c.id !== cardId),
      },
    }));
    setConfirmModal(null);
  };

  // ── Columns ──────────────────────────────────────────────────
  const handleSaveColumn = ({ title, color }) => {
    if (columnModal.mode === 'add') {
      const newId = uuidv4();
      setData((prev) => ({
        columns: [...prev.columns, { id: newId, title, color }],
        cards: { ...prev.cards, [newId]: [] },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === columnModal.column.id ? { ...col, title, color } : col
        ),
      }));
    }
    setColumnModal(null);
  };

  const handleDeleteColumn = (columnId) => {
    setConfirmModal({ type: 'column', columnId });
  };

  const confirmDeleteColumn = () => {
    const { columnId } = confirmModal;
    setData((prev) => {
      const { [columnId]: _, ...restCards } = prev.cards;
      return {
        columns: prev.columns.filter((c) => c.id !== columnId),
        cards: restCards,
      };
    });
    setConfirmModal(null);
  };

  // Find columnId for a card being edited (needed when onEdit is called from KanbanCard)
  const findColumnForCard = (cardId) => {
    for (const [colId, cards] of Object.entries(data.cards)) {
      if (cards.some((c) => c.id === cardId)) return colId;
    }
    return null;
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="flex gap-4 overflow-x-auto pb-4 px-6"
          style={{ alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)' }}
        >
          {data.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={data.cards[column.id] || []}
              onAddCard={(colId) => setCardModal({ mode: 'add', columnId: colId })}
              onEditCard={(card) => {
                const colId = findColumnForCard(card.id);
                if (colId) handleEditCard(colId, card);
              }}
              onDeleteCard={handleDeleteCard}
              onEditColumn={(col) => setColumnModal({ mode: 'edit', column: col })}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          {/* Add column button */}
          <div style={{ flexShrink: 0 }}>
            <button
              onClick={() => setColumnModal({ mode: 'add' })}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: 'transparent',
                color: '#8b90a7',
                border: '1px dashed #2e3349',
                cursor: 'pointer',
                width: '220px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1a1d27';
                e.currentTarget.style.borderColor = '#3e4565';
                e.currentTarget.style.color = '#e8eaf0';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#2e3349';
                e.currentTarget.style.color = '#8b90a7';
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
              Add column
            </button>
          </div>
        </div>
      </DragDropContext>

      {/* Modals */}
      {cardModal && (
        <CardModal
          card={cardModal.mode === 'edit' ? cardModal.card : null}
          onSave={handleSaveCard}
          onClose={() => setCardModal(null)}
        />
      )}
      {columnModal && (
        <ColumnModal
          column={columnModal.mode === 'edit' ? columnModal.column : null}
          onSave={handleSaveColumn}
          onClose={() => setColumnModal(null)}
        />
      )}
      {confirmModal?.type === 'card' && (
        <ConfirmModal
          title="Delete Card"
          message="Are you sure you want to delete this card? This action cannot be undone."
          onConfirm={confirmDeleteCard}
          onClose={() => setConfirmModal(null)}
        />
      )}
      {confirmModal?.type === 'column' && (
        <ConfirmModal
          title="Delete Column"
          message={`Are you sure you want to delete this column and all its cards? This action cannot be undone.`}
          onConfirm={confirmDeleteColumn}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}
