import { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import AuthPage from './components/AuthPage';
import { supabase } from './lib/supabase';
import { createInitialData } from './utils/initialData';

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState({ columns: [], cards: {} });
  const [boardId, setBoardId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  // ── Auth ─────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Data fetching ─────────────────────────────────────────────
  const fetchBoardData = useCallback(async (bid) => {
    const { data: columns } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', bid)
      .order('position');

    const columnIds = (columns || []).map((c) => c.id);

    let cards = [];
    if (columnIds.length) {
      const { data: cardData } = await supabase
        .from('cards')
        .select('*')
        .in('column_id', columnIds)
        .order('position');
      cards = cardData || [];
    }

    const cardsMap = {};
    (columns || []).forEach((col) => { cardsMap[col.id] = []; });
    cards.forEach((card) => {
      if (cardsMap[card.column_id]) {
        cardsMap[card.column_id].push({
          id: card.id,
          title: card.title,
          description: card.description || '',
          createdAt: new Date(card.created_at).getTime(),
        });
      }
    });

    setData({
      columns: (columns || []).map((col) => ({ id: col.id, title: col.title, color: col.color })),
      cards: cardsMap,
    });
  }, []);

  const loadBoardData = useCallback(async (userId) => {
    setDataLoading(true);
    try {
      const { data: boards } = await supabase
        .from('boards')
        .select('id')
        .eq('user_id', userId)
        .order('created_at')
        .limit(1);

      let board;
      if (!boards?.length) {
        // First login — create a board and seed with sample data
        const { data: newBoard, error } = await supabase
          .from('boards')
          .insert({ user_id: userId, name: 'My Board' })
          .select()
          .single();
        if (error) throw error;
        board = newBoard;

        const initial = createInitialData();

        await supabase.from('columns').insert(
          initial.columns.map((col, idx) => ({
            id: col.id,
            board_id: board.id,
            title: col.title,
            color: col.color,
            position: idx,
          }))
        );

        const cardsToInsert = initial.columns.flatMap((col) =>
          (initial.cards[col.id] || []).map((card, idx) => ({
            id: card.id,
            column_id: col.id,
            title: card.title,
            description: card.description || '',
            position: idx,
            created_at: new Date(card.createdAt).toISOString(),
          }))
        );
        if (cardsToInsert.length) {
          await supabase.from('cards').insert(cardsToInsert);
        }
      } else {
        board = boards[0];
      }

      setBoardId(board.id);
      await fetchBoardData(board.id);
    } catch (err) {
      console.error('Error loading board data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [fetchBoardData]);

  useEffect(() => {
    if (session) {
      loadBoardData(session.user.id);
    } else {
      setData({ columns: [], cards: {} });
      setBoardId(null);
    }
  }, [session, loadBoardData]);

  // ── Real-time sync ────────────────────────────────────────────
  useEffect(() => {
    if (!boardId) return;

    const channel = supabase
      .channel(`board-sync:${boardId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'columns', filter: `board_id=eq.${boardId}` },
        () => fetchBoardData(boardId)
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cards' },
        () => fetchBoardData(boardId)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [boardId, fetchBoardData]);

  const handleSignOut = () => supabase.auth.signOut();

  // ── Render ────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        style={{
          backgroundColor: '#0f1117',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#8b90a7', fontSize: '14px' }}>Loading…</span>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  const totalCards = Object.values(data.cards).reduce((sum, cards) => sum + cards.length, 0);

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', backgroundColor: '#0f1117' }}>
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
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ backgroundColor: '#5b6aff' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="4" height="12" rx="1" fill="white" opacity="0.9" />
              <rect x="6" y="2" width="4" height="8" rx="1" fill="white" opacity="0.7" />
              <rect x="11" y="2" width="4" height="5" rx="1" fill="white" opacity="0.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight" style={{ color: '#e8eaf0' }}>
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
                <span className="font-semibold" style={{ color: '#e8eaf0' }}>
                  {(data.cards[col.id] || []).length}
                </span>
              </span>
            ))}
          </div>

          {/* User email */}
          <span
            className="hidden sm:inline text-xs px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: '#1a1d27', border: '1px solid #2e3349', color: '#8b90a7' }}
          >
            {session.user.email}
          </span>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #2e3349',
              color: '#8b90a7',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#21253a';
              e.currentTarget.style.color = '#e8eaf0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#8b90a7';
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 pt-6 overflow-hidden">
        {dataLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
            }}
          >
            <span style={{ color: '#8b90a7', fontSize: '14px' }}>Loading board…</span>
          </div>
        ) : (
          <Board
            data={data}
            setData={setData}
            boardId={boardId}
            supabase={supabase}
          />
        )}
      </main>
    </div>
  );
}
