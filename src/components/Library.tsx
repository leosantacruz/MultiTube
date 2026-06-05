import React, { useState } from 'react';
import { useChannels } from '../contexts/ChannelContext';
import { ChannelGroup } from '../types';
import { getThumbnailUrl } from '../utils/youtubeUtils';
import {
  Play,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  ListVideo,
  Github,
  Tv,
} from 'lucide-react';

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; group: ChannelGroup }
  | null;

/* ---------- Thumbnail mosaic for a playlist card ---------- */
const Mosaic: React.FC<{ group: ChannelGroup }> = ({ group }) => {
  const thumbs = group.channels
    .map((c) => getThumbnailUrl(c.url))
    .filter((t): t is string => !!t)
    .slice(0, 4);

  if (thumbs.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
        <Tv className="text-ink-600" size={48} />
      </div>
    );
  }

  if (thumbs.length === 1) {
    return (
      <img
        src={thumbs[0]}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-ink-900">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="relative overflow-hidden bg-ink-800">
          {thumbs[i % thumbs.length] && (
            <img
              src={thumbs[i % thumbs.length]}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

/* ---------- Single playlist card ---------- */
const PlaylistCard: React.FC<{
  group: ChannelGroup;
  index: number;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ group, index, onPlay, onEdit, onDelete }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onPlay}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPlay()}
    style={{ animationDelay: `${index * 55}ms` }}
    className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-850 shadow-card outline-none transition-all duration-300 animate-fade-in-up hover:-translate-y-1 hover:border-accent-500/40 hover:shadow-glow focus-visible:border-accent-500/60 focus-visible:shadow-glow"
  >
    <Mosaic group={group} />

    {/* darkening overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/80" />

    {/* hover row actions */}
    <div className="absolute right-2.5 top-2.5 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="grid h-8 w-8 place-items-center rounded-full bg-black/55 text-zinc-200 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
        aria-label="Editar playlist"
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="grid h-8 w-8 place-items-center rounded-full bg-black/55 text-zinc-200 backdrop-blur-md transition-colors hover:bg-red-600 hover:text-white"
        aria-label="Eliminar playlist"
      >
        <Trash2 size={15} />
      </button>
    </div>

    {/* center play button */}
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="grid h-16 w-16 translate-y-1 scale-90 place-items-center rounded-full bg-accent-500 text-white opacity-0 shadow-glow transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
        <Play size={26} className="ml-1 fill-current" />
      </div>
    </div>

    {/* bottom meta */}
    <div className="absolute inset-x-0 bottom-0 p-4">
      <h3 className="truncate text-lg font-semibold text-white drop-shadow">
        {group.name}
      </h3>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-zinc-300">
        <ListVideo size={14} className="text-accent-400" />
        {group.channels.length}{' '}
        {group.channels.length === 1 ? 'canal' : 'canales'}
      </p>
    </div>
  </div>
);

/* ---------- Create / Edit modal ---------- */
const PlaylistModal: React.FC<{
  state: Exclude<ModalState, null>;
  onClose: () => void;
}> = ({ state, onClose }) => {
  const { createGroup, updateGroup } = useChannels();
  const isEdit = state.mode === 'edit';

  const [name, setName] = useState(isEdit ? state.group.name : '');
  const [urls, setUrls] = useState(
    isEdit ? state.group.channels.map((c) => c.url).join(', ') : ''
  );
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') return setError('Ponele un nombre a la playlist.');
    if (urls.trim() === '') return setError('Agregá al menos una URL de YouTube.');

    if (isEdit) updateGroup(state.group.id, name, urls);
    else createGroup(name, urls);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-ink-850 p-6 shadow-card animate-scale-in"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Editar playlist' : 'Nueva playlist'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-ink-750 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Nombre
        </label>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Mis streams de noticias"
          className="mb-4 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white placeholder:text-ink-500 transition-shadow focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
        />

        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          URLs de YouTube{' '}
          <span className="font-normal text-zinc-500">(separadas por comas)</span>
        </label>
        <textarea
          value={urls}
          onChange={(e) => {
            setUrls(e.target.value);
            setError('');
          }}
          rows={4}
          placeholder="https://youtube.com/watch?v=… , https://youtu.be/…"
          className="w-full resize-none rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 transition-shadow scrollbar-thin focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
        />

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 font-medium text-zinc-300 transition-colors hover:bg-ink-750 hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 font-semibold text-white shadow-glow-sm transition-all hover:bg-accent-400 active:scale-95"
          >
            <Check size={18} />
            {isEdit ? 'Guardar cambios' : 'Crear playlist'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- Library screen ---------- */
const Library: React.FC = () => {
  const { groups, playGroup, deleteGroup } = useChannels();
  const [modal, setModal] = useState<ModalState>(null);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        {/* header */}
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent-500 shadow-glow-sm">
              <Tv className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Multi<span className="text-accent-500">Tube</span>
              </h1>
              <p className="text-sm text-zinc-400">
                Tus canales favoritos, todos a la vez.
              </p>
            </div>
          </div>

          <button
            onClick={() => setModal({ mode: 'create' })}
            className="flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 font-semibold text-white shadow-glow-sm transition-all hover:bg-accent-400 active:scale-95"
          >
            <Plus size={20} />
            Nueva playlist
          </button>
        </header>

        {/* content */}
        {groups.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-ink-700 bg-ink-900/50 px-6 py-20 text-center animate-fade-in">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-ink-800">
              <ListVideo className="text-accent-400" size={30} />
            </div>
            <h2 className="text-xl font-bold text-white">
              Todavía no hay playlists
            </h2>
            <p className="mt-2 max-w-sm text-zinc-400">
              Creá tu primera playlist para empezar a mirar varios canales de
              YouTube al mismo tiempo.
            </p>
            <button
              onClick={() => setModal({ mode: 'create' })}
              className="mt-6 flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 font-semibold text-white shadow-glow-sm transition-all hover:bg-accent-400 active:scale-95"
            >
              <Plus size={20} />
              Crear playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groups.map((group, i) => (
              <PlaylistCard
                key={group.id}
                group={group}
                index={i}
                onPlay={() => playGroup(group.id)}
                onEdit={() => setModal({ mode: 'edit', group })}
                onDelete={() => {
                  if (
                    window.confirm(
                      `¿Eliminar la playlist "${group.name}"?`
                    )
                  ) {
                    deleteGroup(group.id);
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* footer */}
        <footer className="mt-12 flex justify-center">
          <a
            href="https://github.com/leosantacruz/multitube"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <Github size={16} />
            Ver proyecto en GitHub
          </a>
        </footer>
      </div>

      {modal && <PlaylistModal state={modal} onClose={() => setModal(null)} />}
    </div>
  );
};

export default Library;
