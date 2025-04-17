import { RichPresenceBuilder } from 'discord-rpc.ts';
import { Client } from 'discord.js-selfbot-v13';
import { RichPresence } from './../types/richPresenceOptions';

export const loadRichPresence = async (client: Client, rpc: RichPresence) => {
  switch (rpc.type) {
    case 'Streaming':
      const streamingRPC = new RichPresenceBuilder(client)
        .setType(rpc.type)
        .setField2(rpc.field2!)
        .setField3(rpc.field3!)
        .setURL('https://www.twitch.tv/aquinasctf')
        .setPlatform(rpc.platform!);
      if (rpc.largeImg) {
        await streamingRPC.setLargeImage(rpc.largeImg!).catch(() => null);
      } else {
        await streamingRPC
          .setLargeImage(client.user?.avatarURL()!)
          .catch(() => null);
      }
      if (rpc.smallImg) {
        await streamingRPC.setSmallImage(rpc.smallImg!).catch(() => null);
      }
      streamingRPC.apply();

      break;
    case 'Competing':
      const competingRPC = new RichPresenceBuilder(client)
        .setType(rpc.type)
        .setName(rpc.name!)
        .setField1(rpc.field1!)
        .setField2(rpc.field2!)
        .setPlatform(rpc.platform!);
      if (rpc.largeImg) {
        await competingRPC.setLargeImage(rpc.largeImg!).catch(() => null);
      } else {
        await competingRPC
          .setLargeImage(client.user?.avatarURL()!)
          .catch(() => null);
      }
      if (rpc.smallImg) {
        await competingRPC.setSmallImage(rpc.smallImg!).catch(() => null);
      }
      if (rpc.button1 && !rpc.button2) {
        competingRPC.setButtons({
          label: rpc.button1.label,
          url: rpc.button1.url,
        });
      } else if (rpc.button1 && rpc.button2) {
        competingRPC.setButtons(
          {
            label: rpc.button1.label,
            url: rpc.button1.url,
          },
          {
            label: rpc.button2.label,
            url: rpc.button2.url,
          },
        );
      }
    case 'Listening':
      const listeningRPC = new RichPresenceBuilder(client)
        .setType(rpc.type)
        .setName(rpc.name!)
        .setField1(rpc.field1!)
        .setField2(rpc.field2!)
        .setPlatform(rpc.platform!);
      if (rpc.largeImg) {
        await listeningRPC.setLargeImage(rpc.largeImg!).catch(() => null);
      } else {
        await listeningRPC
          .setLargeImage(client.user?.avatarURL()!)
          .catch(() => null);
      }
      if (rpc.smallImg) {
        await listeningRPC.setSmallImage(rpc.smallImg!).catch(() => null);
      }
      if (rpc.button1 && !rpc.button2) {
        listeningRPC.setButtons({
          label: rpc.button1.label,
          url: rpc.button1.url,
        });
      } else if (rpc.button1 && rpc.button2) {
        listeningRPC.setButtons(
          {
            label: rpc.button1.label,
            url: rpc.button1.url,
          },
          {
            label: rpc.button2.label,
            url: rpc.button2.url,
          },
        );
      }
      listeningRPC.apply();
      break;
    case 'Watching':
      const watchingRPC = new RichPresenceBuilder(client)
        .setType(rpc.type)
        .setName(rpc.name!)
        .setField1(rpc.field1!)
        .setField2(rpc.field2!)
        .setField3(rpc.field3!)
        .setTimestamp(rpc.timestamp.start || new Date(), rpc.timestamp.end)
        .setPlatform(rpc.platform!);
      if (rpc.largeImg) {
        await watchingRPC.setLargeImage(rpc.largeImg!).catch(() => null);
      } else {
        await watchingRPC
          .setLargeImage(client.user?.avatarURL()!)
          .catch(() => null);
      }
      if (rpc.smallImg) {
        await watchingRPC.setSmallImage(rpc.smallImg!).catch(() => null);
      }
      if (rpc.button1 && !rpc.button2) {
        watchingRPC.setButtons({
          label: rpc.button1.label,
          url: rpc.button1.url,
        });
      } else if (rpc.button1 && rpc.button2) {
        watchingRPC.setButtons(
          {
            label: rpc.button1.label,
            url: rpc.button1.url,
          },
          {
            label: rpc.button2.label,
            url: rpc.button2.url,
          },
        );
      }
      watchingRPC.apply();
      break;
    case 'Playing':
      const playingRPC = new RichPresenceBuilder(client)
        .setType(rpc.type)
        .setName(rpc.name!)
        .setField1(rpc.field1!)
        .setField2(rpc.field2!)
        .setField3(rpc.field3!)
        .setParty(rpc.party.current!, rpc.party.max!)
        .setTimestamp(rpc.timestamp.start || new Date(), rpc.timestamp.end)
        .setPlatform(rpc.platform!);
      if (rpc.largeImg) {
        await playingRPC.setLargeImage(rpc.largeImg!).catch(() => null);
      } else {
        await playingRPC
          .setLargeImage(client.user?.avatarURL()!)
          .catch(() => null);
      }
      if (rpc.smallImg) {
        await playingRPC.setSmallImage(rpc.smallImg!).catch(() => null);
      }
      if (rpc.button1 && !rpc.button2) {
        playingRPC.setButtons({
          label: rpc.button1.label,
          url: rpc.button1.url,
        });
      } else if (rpc.button1 && rpc.button2) {
        playingRPC.setButtons(
          {
            label: rpc.button1.label,
            url: rpc.button1.url,
          },
          {
            label: rpc.button2.label,
            url: rpc.button2.url,
          },
        );
      }
      playingRPC.apply();
      break;
  }
};
