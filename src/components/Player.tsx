import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChannels } from '../contexts/ChannelContext';
import ChannelCard from './ChannelCard';
import {
  ArrowLeft,
  Pause,
  Play,
  Volume2,
  VolumeX,
  MousePointerClick,
} from 'lucide-react';

/** Best column count to fill a widescreen viewport for N tiles. */
const columnsFor = (n: number): number => {
  const table: Record<number, number> = {
    1: 1, 2: 2, 3: 3, 4: 2, 5: 3, 6: 3,
    7: 4, 8: 4, 9: 3, 10: 4, 11: 4, 12: 4,
  };
  return table[n] ?? Math.ceil(Math.sqrt(n));
};

const Player: React.FC = () => {
  const {
    activeGroup,
    unmutedChannelId,
    toggleChannelMute,
    toggleChannelPlay,
    stopAllChannels,
    resumeAllChannels,
    openLibrary,
  } = useChannels();

  const [barVisible, setBarVisible] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const hideTimer = useRef<number | null>(null);

  /* auto-hide the control bar when the mouse is idle */
  const nudgeBar = useCallback(() => {
    setBarVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setBarVisible(false), 2800);
  }, []);

  useEffect(() => {
    nudgeBar();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [nudgeBar]);

  /* dismiss the gesture hint after a few seconds */
  useEffect(() => {
    const t = window.setTimeout(() => setShowHint(false), 4500);
    return () => window.clearTimeout(t);
  }, []);

  /* Esc returns to the library (when not exiting fullscreen) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) openLibrary();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openLibrary]);

  if (!activeGroup || activeGroup.channels.length === 0) {
    return (
      <div className="grid h-full place-items-center px-6 text-center">
        <div className="animate-fade-in">
          <p className="text-xl font-semibold text-zinc-200">
            {!activeGroup
              ? 'No hay ninguna playlist seleccionada.'
              : 'Esta playlist no tiene canales.'}
          </p>
          <button
            onClick={openLibrary}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 font-semibold text-white shadow-glow-sm transition-all hover:bg-accent-400 active:scale-95"
          >
            <ArrowLeft size={18} />
            Volver a la biblioteca
          </button>
        </div>
      </div>
    );
  }

  const channels = activeGroup.channels;
  const cols = columnsFor(channels.length);
  const allPaused = channels.every((c) => !c.playing);

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-black"
      onMouseMove={nudgeBar}
    >
      {/* video wall */}
      <div
        className="grid h-full w-full gap-[3px] p-[3px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoRows: '1fr',
        }}
      >
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isUnmuted={channel.id === unmutedChannelId}
            onToggleMute={() => toggleChannelMute(channel.id)}
            onTogglePlay={() => toggleChannelPlay(channel.id)}
          />
        ))}
      </div>

      {/* floating control bar */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent px-3 pb-10 pt-3 transition-all duration-300 ${
          barVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="pointer-events-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              onClick={openLibrary}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              aria-label="Volver a la biblioteca"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-white drop-shadow">
                {activeGroup.name}
              </h2>
              <p className="text-xs text-zinc-300">
                {channels.length} canales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* audio status */}
            <button
              onClick={() =>
                unmutedChannelId && toggleChannelMute(unmutedChannelId)
              }
              disabled={!unmutedChannelId}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium backdrop-blur-md transition-colors ${
                unmutedChannelId
                  ? 'bg-accent-500 text-white shadow-glow-sm hover:bg-accent-400'
                  : 'cursor-default bg-white/10 text-zinc-300'
              }`}
              aria-label={unmutedChannelId ? 'Silenciar todo' : 'Sin audio activo'}
            >
              {unmutedChannelId ? <Volume2 size={17} /> : <VolumeX size={17} />}
              <span className="hidden sm:inline">
                {unmutedChannelId ? 'Audio activo' : 'Silencio'}
              </span>
            </button>

            {/* play / pause all */}
            <button
              onClick={allPaused ? resumeAllChannels : stopAllChannels}
              className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {allPaused ? <Play size={17} /> : <Pause size={17} />}
              <span className="hidden sm:inline">
                {allPaused ? 'Reanudar' : 'Pausar'} todos
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* gesture hint */}
      {showHint && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-40 -translate-x-1/2 animate-fade-in-up">
          <div className="flex items-center gap-2.5 rounded-full bg-black/70 px-4 py-2.5 text-sm text-zinc-100 shadow-card backdrop-blur-md">
            <MousePointerClick size={16} className="text-accent-400" />
            <span>
              <b className="font-semibold text-white">Click</b> activa el audio ·{' '}
              <b className="font-semibold text-white">Doble click</b> pantalla
              completa
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
