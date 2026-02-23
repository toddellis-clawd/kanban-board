import { useState } from 'react';
import Board from './components/Board';
import ColumnModal from './components/ColumnModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createInitialData } from './utils/initialData';

function getStoredData() {
  try {
    const raw = window.localStorage.getItem('kanban-data');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export default function App() {
  const [data, setData] = useLocalStorage('kanban-data', createInitialData());

  const totalCards = Object.values(data.cards).reduce((sum, cards) => sum + cards.length, 0);

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: '100vh', backgroundColor: '#0f1117' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{
          backgroundColor: '#0f1117',
          borderBottom: '1px solid #1e2235',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: '#5b6aff' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="4" height="12" rx="1" fill="white" opacity="0.9"/>
              <rect x="6" y="2" width="4" height="8" rx="1" fill="white" opacity="0.7"/>
              <rect x="11" y="2" width="4" height="5" rx="1" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <div>
            <h1
              className="text-base font-bold leading-tight"
              style={{ color: '#e8eaf0' }}
            >
              Kanban Board
            </h1>
            <p className="text-xs leading-tight" style={{ color: '#555c75' }}>
              {data.columns.length} columns · {totalCards} cards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Column count badges */}
          <div className="hidden sm:flex items-center gap-2">
            {data.columns.map((col) => (
              <span
                key={col.id}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#1a1d27', color: '#8b90a7', border: '1px solid #2e3349' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: col.color, flexShrink: 0 }}
                />
                {col.title}
                <span
                  className="font-semibold"
                  style={{ color: '#e8eaf0' }}
                >
                  {(data.cards[col.id] || []).length}
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 pt-6 overflow-hidden">
        <Board data={data} setData={setData} />
      </main>
    </div>
  );
}
