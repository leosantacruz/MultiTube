import { ChannelGroup } from "../types";
import { defaultChannels } from "../data/defaultChannels";

const STORAGE_KEY = "youtube-multi-viewer-groups";

/**
 * Load channel groups from localStorage
 */
export const loadChannelGroups = (): ChannelGroup[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultChannels;

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse stored channel groups:", error);
    return [];
  }
};

/**
 * Save channel groups to localStorage
 */
export const saveChannelGroups = (groups: ChannelGroup[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error("Failed to save channel groups:", error);
  }
};

/**
 * Create a new group ID
 */
export const createGroupId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
