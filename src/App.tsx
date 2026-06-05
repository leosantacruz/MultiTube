import React from 'react';
import { ChannelProvider, useChannels } from './contexts/ChannelContext';
import Library from './components/Library';
import Player from './components/Player';

const AppContent: React.FC = () => {
  const { isManagingGroups } = useChannels();

  return (
    <div className="h-full">
      {/* key forces a remount per screen so the mount animation plays on every transition */}
      <div key={isManagingGroups ? 'library' : 'player'} className="h-full animate-screen-in">
        {isManagingGroups ? <Library /> : <Player />}
      </div>
    </div>
  );
};

function App() {
  return (
    <ChannelProvider>
      <AppContent />
    </ChannelProvider>
  );
}

export default App;
