import React from 'react';
import { ChannelProvider } from './contexts/ChannelContext';
import Layout from './components/Layout';
import GroupManager from './components/GroupManager';
import ChannelGrid from './components/ChannelGrid';
import { useChannels } from './contexts/ChannelContext';

const AppContent: React.FC = () => {
  const { isManagingGroups } = useChannels();
  
  return (
    <Layout>
      {isManagingGroups ? (
        <GroupManager />
      ) : (
        <ChannelGrid />
      )}
    </Layout>
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