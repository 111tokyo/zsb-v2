import { Client, Message, VoiceChannel } from 'discord.js-selfbot-v13';
import fs from 'node:fs';
import path from 'node:path';
import { selfbot } from '../../main';
import config from '../config';
import {
  deleteUserByToken,
  insertNewUser,
  updateUserToken,
} from '../db/actions';
import { getSpecificUserData, getUserById } from '../db/queries';
import { loadRichPresence } from '../loaders/richpresence';
import { Event } from '../types/event';
import { CommandType, LangType } from '../types/interactions';
import { statusOptions } from '../types/statusOptions';
import { voiceOptions } from '../types/voiceOptions';

class SelfbotUser extends Client {
  public voiceOptions: voiceOptions = {
    voiceChannelId: null,
    selfMute: false,
    selfDeaf: false,
    selfVideo: false,
    selfStream: false,
  };
  public statusOptions: statusOptions = {
    choice: null,
    richPresences: [],
  };
  public commandType: CommandType = 'Slash';
  public lang: LangType = 'en';
  public prefix = '&';
  public snipe: Map<string, Message> = new Map();
  public cache: Map<string, any> = new Map();
  public afk: string | null = null;
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

  private _interval() {
    setInterval(
      () => {
        this.cache.clear();
        this.snipe.clear();
        this.applyVoiceState();
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

  public async applyVoiceState() {
    const { voiceChannelId, selfDeaf, selfMute, selfVideo } = this.voiceOptions;
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
          this.voiceOptions.voiceChannelId = null;
        }
      } else {
        this.voiceOptions.voiceChannelId = null;
      }
    } else {
      this.voiceOptions.voiceChannelId = null;
    }
  }

  public async applyRichPresence() {
    const { choice, richPresences } = this.statusOptions;
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
      this.voiceOptions =
        typeof userData.voiceOptions === 'string'
          ? JSON.parse(userData.voiceOptions)
          : userData.voiceOptions;
      this.statusOptions =
        typeof userData.statusOptions === 'string'
          ? JSON.parse(userData.statusOptions)
          : userData.statusOptions;
      this.commandType = (userData.commandType as CommandType) ?? 'Slash';
      this.lang = (userData.lang as LangType) ?? 'en';
      this.prefix = userData.prefix ?? '&';

      await Promise.all([this.applyVoiceState(), this.applyRichPresence]);
    }
  }

  public async logout() {
    const user = this.user!;
    const userId = user.id;
    const userName = user.username;
    console.log(`[DISCONNECTED] ${userName} | ${userId}`);
    await deleteUserByToken(this.token!);
    await this.deauthorize(selfbot.user!.id);
    this.removeAllListeners().destroy();
    selfbot.selfbotUsers.delete(this.user!.id);
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
    const lang = this.settings.locale?.replace('US-en', 'en') ?? 'fr';

    if (selfbot.selfbotUsers.has(userId)) return 'ALREADY_CONNECTED';

    const selfbotUserDB = await getUserById(userId);

    if (!selfbotUserDB) {
      await this.installUserApps(config.clientId);

      //const components = [{}];

      //await sendNewComponents(this.user!.id, components, this.user!.id, 1000 * 60 * 5);

      await insertNewUser({
        id: userId,
        token,
        username: userName,
        lang: lang,
      });
    } else if (selfbotUserDB.token !== token) {
      await updateUserToken(userId, token);
    }

    await Promise.all([
      this._loadInitialData(),
      this._initEvents(),
      this._interval(),
    ]);

    const loginTime = Date.now() - this._createdAt;
    selfbot.selfbotUsers.set(userId, this);
    console.log(`[CONNECTED] ${userName} | ${userId} | ${loginTime}ms`);

    return response;
  }
}

export default SelfbotUser;
