import { Channel } from '../types';

/**
 * Extract YouTube video ID from various YouTube URL formats.
 * Handles:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - youtube.com/v/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 */
export const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;
  // Improved regex for YouTube IDs (11 characters)
  // Captures the ID directly in group 1
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
};

/**
 * Convert any YouTube URL to an embed URL
 */
export const getEmbedUrl = (url: string): string | null => {
  const videoId = extractYoutubeId(url);
  if (!videoId) return null;

  // Parameters for secure embedding with minimal UI
  const params = new URLSearchParams({
    enablejsapi: '1',    // Required for JavaScript API control
    rel: '0',            // Don't show related videos from other channels
    controls: '1',       // Show player controls
    modestbranding: '1', // Less intrusive YouTube logo
    autoplay: '1',       // Try to autoplay
    mute: '1',           // ESSENTIAL for autoplay to work in most browsers
    playsinline: '1',    // Required for inline playback on iOS
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Create a new channel object from URL
 */
export const createChannel = (url: string): Channel | null => {
  const id = extractYoutubeId(url);
  if (!id) return null;

  return {
    id,
    url,
    muted: true,  // Matches mute=1 in embed URL
    playing: true // Initial playback state
  };
};

/**
 * Parse a comma-separated list of URLs into channel objects
 */
export const parseChannelUrls = (urlsString: string): Channel[] => {
  if (!urlsString || typeof urlsString !== 'string') {
    return [];
  }
  return urlsString
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .map(url => createChannel(url))
    .filter((channel): channel is Channel => channel !== null);
};