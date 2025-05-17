import React, { useRef, useEffect } from "react";
import { Channel } from "../types";
import { getEmbedUrl } from "../utils/youtubeUtils";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedUrl = getEmbedUrl(channel.url);

  // Control iframe playback state using YouTube Player API
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const message = channel.playing
      ? JSON.stringify({ event: "command", func: "playVideo", args: [] })
      : JSON.stringify({ event: "command", func: "pauseVideo", args: [] });

    try {
      iframe.contentWindow.postMessage(message, "*");
    } catch (e) {
      console.error("Failed to control video playback:", e);
    }
  }, [channel.playing, isUnmuted]);

  // Control mute/unmute using postMessage
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const message = JSON.stringify({
      event: "command",
      func: isUnmuted ? "unMute" : "mute",
      args: [],
    });

    try {
      iframe.contentWindow.postMessage(message, "*");
    } catch (e) {
      console.error("Failed to control mute state:", e);
    }
  }, [isUnmuted]);

  // Handle video unavailable error
  if (!embedUrl) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-center p-4 h-full">
        <div className="text-red-500 text-center">
          <p className="font-semibold">Invalid YouTube URL</p>
          <p className="text-sm text-gray-400 mt-2">{channel.url}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col relative group h-full">
      <div className="relative w-full pt-[56.25%] bg-black">
        <iframe
          ref={iframeRef}
          src={`${embedUrl}&enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          title={`YouTube video ${channel.id}`}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
        <button
          onClick={onTogglePlay}
          className="p-2 rounded-full bg-gray-800/90 hover:bg-gray-700 transition-colors"
          aria-label={channel.playing ? "Pause" : "Play"}
        >
          {channel.playing ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
          onClick={onToggleMute}
          className={`p-2 rounded-full transition-colors ${
            isUnmuted
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-800/90 hover:bg-gray-700"
          }`}
          aria-label={isUnmuted ? "Mute" : "Unmute"}
        >
          {isUnmuted ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </div>
  );
};

export default ChannelCard;
