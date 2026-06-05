import React, { useEffect, useRef, useState } from 'react';
import { Channel } from '../types';
import { getEmbedUrl } from '../utils/youtubeUtils';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
  isUnmuted: boolean;
  onToggleMute: () => void;
  onTogglePlay: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isUnmuted,
  onToggleMute,
  onTogglePlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clickTimer = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pulse, setPulse] = useState<'mute' | 'unmute' | null>(null);
  const embedUrl = getEmbedUrl(channel.url);

  /* control playback via the YouTube iframe API */
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const func = channel.playing ? 'playVideo' : 'pauseVideo';
    try {
      win.postMessage(
        JSON.stringify({ event: 'command', func, args: [] }),
        '*'
      );
    } catch {
      /* ignore cross-origin timing errors */
    }
  }, [channel.playing]);

  /* control mute state via the YouTube iframe API */
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage(
        JSON.stringify({
          event: 'command',
          func: isUnmuted ? 'unMute' : 'mute',
          args: [],
        }),
        '*'
      );
    } catch {
      /* ignore */
    }
  }, [isUnmuted]);

  /* track fullscreen state for this card */
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const flashPulse = (kind: 'mute' | 'unmute') => {
    setPulse(kind);
    window.setTimeout(() => setPulse(null), 600);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
      // give the spotlighted video its audio
      if (!isUnmuted) onToggleMute();
    }
  };

  /* single click → toggle audio · double click → fullscreen */
  const handleClick = () => {
    if (clickTimer.current) return; // part of a double-click
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = null;
      onToggleMute();
      flashPulse(isUnmuted ? 'mute' : 'unmute');
    }, 220);
  };

  const handleDoubleClick = () => {
    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    toggleFullscreen();
  };

  if (!embedUrl) {
    return (
      <div className="grid h-full place-items-center bg-ink-900 p-4 text-center">
        <div>
          <p className="font-semibold text-red-400">URL de YouTube inválida</p>
          <p className="mt-1 truncate text-xs text-zinc-500">{channel.url}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden bg-black transition-shadow duration-300 ${
        isUnmuted
          ? 'z-10 ring-2 ring-accent-500 shadow-glow'
          : 'ring-1 ring-white/[0.04]'
      } ${isFullscreen ? '' : 'rounded-lg'}`}
    >
      <iframe
        ref={iframeRef}
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        title={`YouTube ${channel.id}`}
      />

      {/* gesture surface: click = audio, double click = fullscreen */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />

      {/* audio badge (always visible when this card has sound) */}
      {isUnmuted && (
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-20 flex items-center gap-1.5 rounded-full bg-accent-500 px-2.5 py-1 text-xs font-semibold text-white shadow-glow-sm animate-scale-in">
          <Volume2 size={13} />
          Audio
        </div>
      )}

      {/* center pulse feedback on audio toggle */}
      {pulse && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-black/60 text-white animate-ping-once">
            {pulse === 'unmute' ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </div>
        </div>
      )}

      {/* hover toolbar */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-t from-black/85 to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay();
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
          aria-label={channel.playing ? 'Pausar' : 'Reproducir'}
        >
          {channel.playing ? <Pause size={17} /> : <Play size={17} />}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
              flashPulse(isUnmuted ? 'mute' : 'unmute');
            }}
            className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition-colors ${
              isUnmuted
                ? 'bg-accent-500 text-white hover:bg-accent-400'
                : 'bg-white/10 text-white hover:bg-white/25'
            }`}
            aria-label={isUnmuted ? 'Silenciar' : 'Activar audio'}
          >
            {isUnmuted ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
