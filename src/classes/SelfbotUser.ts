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
import { sendJSONEmbed } from '../util/sendJSONEmbed';

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
        this._applyVoiceState();
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

  public async _applyRichPresence() {
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

      await Promise.all([this._applyVoiceState(), this._applyRichPresence]);
    }
  }

  public async logout() {
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

      const embeds = [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 10,
              content: 'Always hug a stranger before you become famous.',
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 1,
              components: [
                {
                  type: 3,
                  custom_id: 'dbf6b21b80c54f03a4194c79b0ac271a',
                  options: [
                    {
                      label: 'Curious Coyote',
                      value: 'c5b1b346c40f4673a97730504f507a36',
                      description: null,
                      emoji: null,
                      default: false,
                    },
                    {
                      label: 'Agile Cassowary',
                      value: '401f0b3c38f341d0aec288e4015284c1',
                      description: null,
                      emoji: null,
                      default: false,
                    },
                  ],
                  placeholder: '',
                  min_values: 1,
                  max_values: 1,
                  disabled: false,
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 2,
                  label: 'Candid Goose',
                  emoji: null,
                  disabled: false,
                  custom_id: '39919931b614408ccd4bef3f12efe825',
                },
                {
                  type: 2,
                  style: 5,
                  label: 'Tall Mosquito',
                  emoji: null,
                  disabled: false,
                  url: 'https://google.com',
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 9,
              accessory: {
                type: 2,
                style: 2,
                label: 'Rough Red Panda',
                emoji: null,
                disabled: false,
                custom_id: '0e59228baa1f40e9b0e247e465f8e374',
              },
              components: [
                {
                  type: 10,
                  content: 'Never trust a lizard with a toaster.',
                },
                {
                  type: 10,
                  content: 'Never trust a cat with a toaster.',
                },
              ],
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
          ],
        },
      ];

      await sendJSONEmbed('1363522373654937921', embeds);

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
