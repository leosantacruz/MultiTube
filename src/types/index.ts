export interface Channel {
  id: string;
  url: string;
  muted: boolean;
  playing: boolean;
}

export interface ChannelGroup {
  id: string;
  name: string;
  channels: Channel[];
}