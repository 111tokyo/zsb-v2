import { PlatformType, RichPresenceType } from 'discord-rpc.ts';

export type RichPresenceOptions = {
  choice: string | null;
  richPresences: RichPresence[];
};

export type RichPresence = {
  id: string;
  name: string | null;
  field1: string | null;
  field2: string | null;
  field3: string | null;
  type: RichPresenceType;
  platform: PlatformType;
  party: {
    current: number;
    max: number;
  };
  timestamp: { start?: Date; end?: Date };
  smallImg: string | null;
  largeImg: string | null;
  button1: { label: string; url: string } | null;
  button2: { label: string; url: string } | null;
};
