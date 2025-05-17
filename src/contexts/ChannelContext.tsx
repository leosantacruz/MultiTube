import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ChannelGroup } from "../types";
import {
  loadChannelGroups,
  saveChannelGroups,
  createGroupId,
} from "../utils/localStorage";
import { parseChannelUrls } from "../utils/youtubeUtils";

interface ChannelContextType {
  groups: ChannelGroup[];
  activeGroupId: string | null;
  activeGroup: ChannelGroup | null;
  unmutedChannelId: string | null;
  isManagingGroups: boolean;

  setActiveGroupId: (id: string | null) => void;
  toggleManagingGroups: () => void;
  createGroup: (name: string, urlsString: string) => void;
  updateGroup: (id: string, name: string, urlsString: string) => void;
  deleteGroup: (id: string) => void;
  toggleChannelMute: (channelId: string) => void;
  toggleChannelPlay: (channelId: string) => void;
  stopAllChannels: () => void;
  resumeAllChannels: () => void;
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [groups, setGroups] = useState<ChannelGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [unmutedChannelId, setUnmutedChannelId] = useState<string | null>(null);
  const [isManagingGroups, setIsManagingGroups] = useState<boolean>(true);

  // Load channel groups from localStorage on initial render
  useEffect(() => {
    const loadedGroups = loadChannelGroups();
    setGroups(loadedGroups);

    // If there are groups, set the first one as active
    if (loadedGroups.length > 0) {
      setActiveGroupId(loadedGroups[0].id);
    }
  }, []);

  // Save channel groups to localStorage whenever they change
  useEffect(() => {
    saveChannelGroups(groups);
  }, [groups]);

  // Get the active group based on activeGroupId
  const activeGroup =
    groups.find((group) => group.id === activeGroupId) || null;

  // Toggle between managing groups and viewing channels
  const toggleManagingGroups = () => {
    setIsManagingGroups((prev) => !prev);
    // Reset unmuted channel when switching views
    setUnmutedChannelId(null);
  };

  // Create a new channel group
  const createGroup = (name: string, urlsString: string) => {
    const channels = parseChannelUrls(urlsString);

    const newGroup: ChannelGroup = {
      id: createGroupId(),
      name,
      channels,
    };

    setGroups((prev) => [...prev, newGroup]);

    // If this is the first group, set it as active
    if (groups.length === 0) {
      setActiveGroupId(newGroup.id);
    }
  };

  // Update an existing channel group
  const updateGroup = (id: string, name: string, urlsString: string) => {
    const channels = parseChannelUrls(urlsString);

    setGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, name, channels } : group
      )
    );
  };

  // Delete a channel group
  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== id));

    // If the deleted group was active, set the first available group as active
    if (activeGroupId === id) {
      const remainingGroups = groups.filter((group) => group.id !== id);
      setActiveGroupId(
        remainingGroups.length > 0 ? remainingGroups[0].id : null
      );
    }
  };

  // Toggle mute state for a channel (ensuring only one channel is unmuted)
  const toggleChannelMute = (channelId: string) => {
    if (!activeGroup) return;

    // If the channel is already unmuted, mute it
    if (unmutedChannelId === channelId) {
      setUnmutedChannelId(null);

      setGroups((prev) =>
        prev.map((group) =>
          group.id === activeGroupId
            ? {
                ...group,
                channels: group.channels.map((channel) =>
                  channel.id === channelId
                    ? { ...channel, muted: true }
                    : channel
                ),
              }
            : group
        )
      );
    }
    // Otherwise, mute all channels and unmute the selected one
    else {
      setUnmutedChannelId(channelId);

      setGroups((prev) =>
        prev.map((group) =>
          group.id === activeGroupId
            ? {
                ...group,
                channels: group.channels.map((channel) => ({
                  ...channel,
                  muted: channel.id !== channelId,
                })),
              }
            : group
        )
      );
    }
  };

  // Toggle play state for a channel
  const toggleChannelPlay = (channelId: string) => {
    if (!activeGroup) return;

    setGroups((prev) =>
      prev.map((group) =>
        group.id === activeGroupId
          ? {
              ...group,
              channels: group.channels.map((channel) =>
                channel.id === channelId
                  ? { ...channel, playing: !channel.playing }
                  : channel
              ),
            }
          : group
      )
    );
  };

  // Stop all channels in the active group
  const stopAllChannels = () => {
    if (!activeGroup) return;

    setGroups((prev) =>
      prev.map((group) =>
        group.id === activeGroupId
          ? {
              ...group,
              channels: group.channels.map((channel) => ({
                ...channel,
                playing: false,
              })),
            }
          : group
      )
    );
  };

  // Resume all channels in the active group
  const resumeAllChannels = () => {
    if (!activeGroup) return;

    setGroups((prev) =>
      prev.map((group) =>
        group.id === activeGroupId
          ? {
              ...group,
              channels: group.channels.map((channel) => ({
                ...channel,
                playing: true,
              })),
            }
          : group
      )
    );
  };

  const value = {
    groups,
    activeGroupId,
    activeGroup,
    unmutedChannelId,
    isManagingGroups,
    setActiveGroupId,
    toggleManagingGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleChannelMute,
    toggleChannelPlay,
    stopAllChannels,
    resumeAllChannels,
  };

  return (
    <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>
  );
};

export const useChannels = (): ChannelContextType => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error("useChannels must be used within a ChannelProvider");
  }
  return context;
};
