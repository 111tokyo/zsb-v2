import { Client, Message, VoiceChannel } from 'discord.js-selfbot-v13';
import fs from 'node:fs';
import path from 'node:path';
import { selfbot } from '../../main';
import config from '../config';
import { insertNewUser, updateUserToken } from '../db/actions';
import { getSpecificUserData, getUserById } from '../db/queries';
import { loadRichPresence } from '../loaders/richpresence';
import { Event } from '../types/event';
import { CommandType, LangType } from '../types/interactions';
import { RichPresenceOptions } from '../types/richPresenceOptions';
import { VoiceStateOptions } from '../types/voiceStateOptions';

class SelfbotUser extends Client {
  public voiceStateOptions: VoiceStateOptions = {
    voiceChannelId: null,
    selfMute: false,
    selfDeaf: false,
    selfVideo: false,
    selfStream: false,
  };
  public richPresenceOptions: RichPresenceOptions = {
    choice: null,
    richPresences: [],
  };
  public commandType: CommandType = 'Slash';
  public lang: LangType = 'en';
  public prefix = '&';
  public snipe: Map<string, Message> = new Map();
  public cache: Map<string, any> = new Map();
  private _createdAt = Date.now();

  constructor() {
    super({
      partials: [
        'USER',
        'CHANNEL',
        'GUILD_MEMBER',
        'MESSAGE',
        'REACTION',
        'GUILD_SCHEDULED_EVENT',
      ],
    });
  }

  private _clearCache() {
    setInterval(
      () => {
        this.cache.clear();
        this.snipe.clear();
      },
      1000 * 60 * 60 * 3,
    );
  }

  private async _initEvents() {
    const eventsPath = fs.existsSync('./.build/events')
      ? path.resolve('./.build/events')
      : path.resolve('./events');

    const events = fs
      .readdirSync(eventsPath)
      .filter(
        file =>
          (file.endsWith('.ts') || file.endsWith('.js')) &&
          !file.endsWith('.d.ts'),
      );

    const promises = events.map(async file => {
      const filePath = path.join(eventsPath, file);
      const { event }: { event: Event } = await import(filePath);
      return [
        event.type,
        (...args: any[]) => event.execute(selfbot, this, ...args),
      ] as const;
    });

    const results = await Promise.allSettled(promises);
    for (const result of results) {
      if (result.status === 'fulfilled') {
        const [type, handler] = result.value;
        this.on(type, handler as (...args: any[]) => void);
      }
    }
  }

  public async _applyVoiceState() {
    const { voiceChannelId, selfDeaf, selfMute, selfVideo } =
      this.voiceStateOptions;
    if (voiceChannelId) {
      const channel = this.channels.cache.get(voiceChannelId);
      if (channel && channel.isVoice()) {
        try {
          await this.voice.joinChannel(channel as VoiceChannel, {
            selfDeaf,
            selfMute,
            selfVideo,
          });
        } catch {
          this.voiceStateOptions.voiceChannelId = null;
        }
      } else {
        this.voiceStateOptions.voiceChannelId = null;
      }
    } else {
      this.voiceStateOptions.voiceChannelId = null;
    }
  }

  public async _applyRichPresence() {
    const { choice, richPresences } = this.richPresenceOptions;
    if (choice) {
      const rpc = richPresences.find(rpc => rpc.id === choice);
      if (rpc) await loadRichPresence(this, rpc);
    }
  }

  private async _loadInitialData() {
    const user = this.user;
    if (!user) return;
    const userData = await getSpecificUserData(user.id);

    if (userData) {
      this.voiceStateOptions =
        typeof userData.voiceStateOptions === 'string'
          ? JSON.parse(userData.voiceStateOptions)
          : userData.voiceStateOptions;
      this.richPresenceOptions =
        typeof userData.richPresenceOptions === 'string'
          ? JSON.parse(userData.richPresenceOptions)
          : userData.richPresenceOptions;
      this.commandType = (userData.commandType as CommandType) ?? 'Slash';
      this.lang = (userData.lang as LangType) ?? 'en';
      this.prefix = userData.prefix ?? '&';

      await Promise.all([this._applyVoiceState(), this._applyRichPresence()]);
    }
  }

  public async login(token: string): Promise<string> {
    let response: string;
    try {
      response = await super.login(token);
    } catch {
      return 'INVALID_TOKEN';
    }

    const user = this.user!;
    const userId = user.id;
    const userName = user.username;
    const lang = this.settings.locale?.replace("US-en", "en") ?? "fr"

    if (selfbot.selfbotUsers.has(userId)) return 'ALREADY_CONNECTED';

    const selfbotUserDB = await getUserById(userId);
    
    if (!selfbotUserDB) {
      this.installUserApps(config.clientId);
      await insertNewUser({
        id: userId,
        token,
        username: userName,
        lang: lang
      });
      console.log(`[CREATED] New user entry for ${userName}`);
    } else if (selfbotUserDB.token !== token) {
      await updateUserToken(userId, token);
      console.log(`[UPDATED] Token for ${userName}`);
    }

    await Promise.all([
      this._loadInitialData(),
      this._initEvents(),
      this._clearCache(),
    ]);

    const loginTime = Date.now() - this._createdAt;
    selfbot.selfbotUsers.set(userId, this);
    console.log(`[CONNECTED] ${userName} | ${userId} | ${loginTime}ms`);

    return response;
  }
}

export default SelfbotUser;
