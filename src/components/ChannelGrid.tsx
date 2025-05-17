import React from 'react';
import { useChannels } from '../contexts/ChannelContext';
import ChannelCard from './ChannelCard';
import { PauseCircle, PlayCircle } from 'lucide-react';

const ChannelGrid: React.FC = () => {
  const { 
    activeGroup, 
    unmutedChannelId,
    toggleChannelMute,
    toggleChannelPlay,
    stopAllChannels, 
    resumeAllChannels
  } = useChannels();
  
  if (!activeGroup) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-400 text-xl">No hay grupo de canales seleccionado.</p>
        <p className="text-gray-500 mt-2">
          Selecciona un grupo desde la pantalla de administración para comenzar a ver.
        </p>
      </div>
    );
  }
  
  if (activeGroup.channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-gray-400 text-xl">No hay canales en este grupo.</p>
        <p className="text-gray-500 mt-2">
          Edita este grupo para agregar algunos canales de YouTube.
        </p>
      </div>
    );
  }
  
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-3';
    if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
    if (count <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (count <= 8) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4';
  };

  const getGridRows = (count: number) => {
    if (count <= 4) return 'grid-rows-1';
    if (count <= 8) return 'grid-rows-2';
    return 'grid-rows-3';
  };
  
  const allChannelsPaused = activeGroup.channels.every(channel => !channel.playing);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{activeGroup.name}</h2>
        
        <button
          onClick={allChannelsPaused ? resumeAllChannels : stopAllChannels}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
        >
          {allChannelsPaused ? (
            <>
              <PlayCircle size={18} />
              <span>Reanudar Todos</span>
            </>
          ) : (
            <>
              <PauseCircle size={18} />
              <span>Pausar Todos</span>
            </>
          )}
        </button>
      </div>
      
      <div className={`grid ${getGridCols(activeGroup.channels.length)} ${getGridRows(activeGroup.channels.length)} gap-4 auto-rows-fr`}>
        {activeGroup.channels.map(channel => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isUnmuted={channel.id === unmutedChannelId}
            onToggleMute={() => toggleChannelMute(channel.id)}
            onTogglePlay={() => toggleChannelPlay(channel.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelGrid;