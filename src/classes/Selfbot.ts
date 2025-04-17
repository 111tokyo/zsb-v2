import {
  ActivityType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  MessageFlags,
  Partials,
  PresenceUpdateStatus,
  WebhookClient,
} from 'discord.js';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import config from '../config';
import { deleteUserByToken } from '../db/actions';
import { getAllUsersToken } from '../db/queries';
import { loadContextMenu } from '../loaders/contextCommands';
import { loadMessageCommand } from '../loaders/messageCommands';
import {
  loadSlashCommand,
  settingUpSlashCommands,
} from '../loaders/slashCommands';
import SeflbotUser from './SelfbotUser';

class Selfbot extends Client {
  public selfbotUsers = new Map<string, SeflbotUser>();
  public messageCommandInteraction = new Map<string, any>();
  public slashCommandInteraction = new Map<string, any>();
  public contextMenuInteraction = new Map<string, any>();
  public userNb = 0;
  private _webhookClient = new WebhookClient({
    url: config.webhookURL,
  });

  constructor() {
    super({
      intents: Object.keys(GatewayIntentBits).map((a: string) => {
        return GatewayIntentBits[a as keyof typeof GatewayIntentBits];
      }),
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
      ],
      presence: {
        activities: [
          {
            name: `v${config.sbVersion}`,
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/aquinasctf',
          },
        ],
        status: PresenceUpdateStatus.Idle,
      },
    });
  }

  private async _initInteractions() {
    const interactionsPath = existsSync('./.build/interactions')
      ? './.build/interactions'
      : './interactions';

    const getInteractions = async (dirPath: string): Promise<string[]> => {
      let InteractionPaths: string[] = [];

      const entries = await readdir(dirPath, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          InteractionPaths = InteractionPaths.concat(
            await getInteractions(fullPath),
          );
        } else if (entry.isFile()) {
          const isScriptFile =
            fullPath.endsWith('.js') || fullPath.endsWith('.ts');
          const isDefinitionFile = fullPath.endsWith('.d.ts');

          if (isScriptFile && !isDefinitionFile) {
            InteractionPaths.push(fullPath);
          }
        }
      }

      return InteractionPaths;
    };

    const Interactions = await getInteractions(interactionsPath);

    const promises = Interactions.map(fullInteractionPath => {
      const interactionType = basename(fullInteractionPath)
        .replace('.js', '')
        .replace('.ts', '');

      const interactionPath = dirname(fullInteractionPath);
      const interactionSubPath = relative(
        interactionsPath,
        interactionPath,
      ).replace(/\\/g, '/');

      if (interactionType === 'command') {
        return loadSlashCommand(this, interactionSubPath);
      }

      if (interactionType === 'message') {
        return loadMessageCommand(this, interactionSubPath);
      }

      if (interactionType === 'context') {
        return loadContextMenu(this, interactionSubPath);
      }

      return Promise.resolve();
    });

    await Promise.all(promises);

    settingUpSlashCommands(this);

    this.on('interactionCreate', async interaction => {
      if (interaction.isChatInputCommand()) {
        const command = this.slashCommandInteraction.get(
          interaction.options.getSubcommand(false) || interaction.commandName,
        );

        const selbotUser = this.selfbotUsers.get(interaction.user.id);

        if (!selbotUser) {
          interaction.reply({
            content:
              interaction.locale === 'fr'
                ? `Pour utiliser cette interaction, vous devez tout d'abord vous [connecter ici](${config.supportServerInvite}) !`
                : `To use this interaction, you must first [log in here](${config.supportServerInvite})!`,
            flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
          });
          return;
        }

        if (selbotUser.commandType === 'Prefix') {
          interaction.reply({
            content:
              selbotUser.lang === 'fr'
                ? 'Vous avez désactivé les commandes slash. Vous ne pouvez utiliser que les commandes via préfixe.'
                : 'You have disabled slash commands. You can only use prefix-based commands.',
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        try {
          command.execute(selbotUser, interaction);
        } catch {
          interaction.reply({
            content:
              selbotUser.lang === 'fr'
                ? "Vous êtes perdu(e) ? Cette interaction n'existe pas, vous feriez mieux de rafraîchir votre application en utilisant `Ctrl + R` sur votre PC ou en relançant l'application sur votre téléphone."
                : 'Are you lost? This interaction does not exist. You should refresh your application by pressing `Ctrl + R` on your PC or restarting the app on your phone.',
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      if (interaction.isContextMenuCommand()) {
        const contextMenu = this.contextMenuInteraction.get(
          interaction.commandName,
        );

        const selbotUser = this.selfbotUsers.get(interaction.user.id);

        if (!selbotUser) {
          interaction.reply({
            content:
              interaction.locale === 'fr'
                ? `Pour utiliser cette interaction, vous devez tout d'abord vous [connecter ici](${config.supportServerInvite}) !`
                : `To use this interaction, you must first [log in here](${config.supportServerInvite})!`,
            flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
          });
          return;
        }

        try {
          contextMenu.execute(selbotUser, interaction);
        } catch {
          interaction.reply({
            content:
              interaction.locale === 'fr'
                ? "Vous êtes perdu(e) ? Cette interaction n'existe pas, vous feriez mieux de rafraîchir votre application en utilisant `Ctrl + R` sur votre PC ou en relançant l'application sur votre téléphone."
                : 'Are you lost? This interaction does not exist. You should refresh your application by pressing `Ctrl + R` on your PC or restarting the app on your phone.',
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    });
  }

  private async _initSelfbotUsers() {
    await getAllUsersToken().then(
      async (selfbotUsersDB: { token: string }[] | undefined) => {
        if (!Array.isArray(selfbotUsersDB)) return;

        const promises = selfbotUsersDB
          .filter(
            (selfbotUserDB): selfbotUserDB is { token: string } =>
              !!selfbotUserDB && typeof selfbotUserDB.token === 'string',
          )
          .map(async selfbotUserDB => {
            const selfbotUser = new SeflbotUser();

            return await selfbotUser
              .login(selfbotUserDB.token)
              .then(async (response: string) => {
                if (response === 'INVALID_TOKEN') {
                  await deleteUserByToken(selfbotUserDB.token).then(() =>
                    console.log(
                      `[DISCONNECTED] Token removed: ${selfbotUserDB.token}`,
                    ),
                  );
                } else {
                  this.userNb++;
                }
              });
          });

        await Promise.all(promises);
      },
    );
  }

  public sendWebhook(title: string, message: string) {
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle(title)
      .setDescription(message);

    this._webhookClient.send({
      embeds: [embed],
      username: 'Logs',
      avatarURL: this.user?.avatarURL()!,
    });
  }

  public async login(token: string): Promise<string> {
    let response: string;

    response = await super
      .login(token)
      .catch(() => (response = 'INVALID_TOKEN'));

    await this._initInteractions();
    await this._initSelfbotUsers();

    return response;
  }

  public async initAfterLogin() {
    await Promise.all([this._initInteractions(), this._initSelfbotUsers()]);
  }
}

export default Selfbot;
