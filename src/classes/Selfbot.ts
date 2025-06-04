import {
  ActivityType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  Message,
  MessageFlags,
  Partials,
  WebhookClient,
} from 'discord.js';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { api } from '../../api/v1';
import config from '../config';
import { deleteUserByToken } from '../db/actions';
import { getAllUsersToken } from '../db/queries';
import { loadContextMenu } from '../loaders/contextCommands';
import { loadMessageCommand } from '../loaders/messageCommands';
import { loadOwnerCommand } from '../loaders/ownerCommands';
import { loadSlashCommand } from '../loaders/slashCommands';
import {
  ContextCommand,
  MessageCommand,
  OwnerCommand,
  SlashCommand,
} from '../types/interactions';
import SelfbotUser from './SelfbotUser';

class Selfbot extends Client {
  public selfbotUsers = new Map<string, SelfbotUser>();
  public messageCommandInteraction = new Map<string, MessageCommand>();
  public ownerCommandInteraction = new Map<string, OwnerCommand>();
  public slashCommandInteraction = new Map<string, SlashCommand>();
  public contextMenuInteraction = new Map<string, ContextCommand>();
  public userNb = 0;
  public voiceChannel = 0;
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
    });
  }

  private async _initInteractions() {
    const interactionsPath = existsSync('./.build/commands')
      ? './.build/commands'
      : './commands';

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

      if (interactionType === 'slash') {
        return loadSlashCommand(this, interactionSubPath);
      }

      if (interactionType === 'message') {
        return loadMessageCommand(this, interactionSubPath);
      }

      if (interactionType === 'context') {
        return loadContextMenu(this, interactionSubPath);
      }

      if (interactionType === 'owner') {
        return loadOwnerCommand(this, interactionSubPath);
      }

      return Promise.resolve();
    });

    await Promise.all(promises);

    this.on('messageCreate', async (message: Message) => {
      if (message.author.bot) return;
      if (message.content.startsWith(';')) {
        const commandName = message.content.slice(1).trim().split(' ')[0];
        const args = message.content.slice(1).trim().split(' ').slice(1);
        const command = this.ownerCommandInteraction.get(commandName);
        if (!command) return;
        const owners = [
          '1361345963175968779',
          '944242927528460338',
          '1130887236976660551',
        ];

        if (!owners.includes(message.author!.id)) return;

        await command!.execute(this, message, args);
      }

      return;
    });
    this.on('interactionCreate', async interaction => {
      if (interaction.isChatInputCommand()) {
        const command = this.slashCommandInteraction.get(
          interaction.commandName,
        );

        const selfbotUser = this.selfbotUsers.get(interaction.user.id);

        if (!selfbotUser) {
          await interaction.reply({
            content:
              interaction.locale === 'fr'
                ? `Pour utiliser cette interaction, vous devez tout d'abord vous [connecter ici](${config.supportServerInvite})!`
                : `To use this interaction, you must first [log in here](${config.supportServerInvite})!`,
            flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
          });
          return;
        }

        if (!(await selfbotUser.guilds.fetch(config.supportServerId))) {
          await interaction.reply({
            content:
              selfbotUser.lang === 'fr'
                ? `Pour utiliser User.exe, vous devez être sur le [serveur de support](${config.supportServerInvite})!`
                : `To use User.exe, you must be in the [support server](${config.supportServerInvite})!`,
            flags: [MessageFlags.Ephemeral, MessageFlags.SuppressEmbeds],
          });
          return;
        }

        if (selfbotUser.commandType === 'Prefix') {
          await interaction.reply({
            content:
              selfbotUser.lang === 'fr'
                ? 'Vous avez désactivé les commandes slash. Vous ne pouvez utiliser que les commandes via préfixe.'
                : 'You have disabled slash commands. You can only use prefix-based commands.',
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (
          selfbotUser.cooldowns.get(`slashCommand_${interaction.commandName}`)
        ) {
          await interaction.reply({
            content:
              selfbotUser.lang === 'fr'
                ? 'Attention vous exécutez cette commande trop rapidement! Veuillez patienter un instant avant de réessayer..'
                : "Warning you're executing this command too quickly! Please wait a moment and try again.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        try {
          await command?.execute(selfbotUser, interaction);

          let commandCooldown;
          if (
            selfbotUser.cooldowns.get(`slashCommand_${interaction.commandName}`)
          ) {
            commandCooldown =
              selfbotUser.cooldowns.get(
                `slashCommand_${interaction.commandName}`,
              )! * 3;
          } else {
            commandCooldown = 1000;
          }

          selfbotUser.cooldowns.set(
            `slashCommand_${interaction.commandName}`,
            commandCooldown,
          );
          setTimeout(() => {
            selfbotUser.cooldowns.delete(
              `slashCommand_${interaction.commandName}`,
            );
          }, commandCooldown);
        } catch (e) {
          console.log(e);
          await interaction.reply({
            content:
              selfbotUser.lang === 'fr'
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
          contextMenu?.execute(selbotUser, interaction);
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

      if (interaction.isButton()) {
        const selbotUser = this.selfbotUsers.get(interaction.user.id);

        const ignoreButton = [
          'help_back',
          'help_next',
          'next',
          'previous',
        ].includes(interaction.customId);

        if (ignoreButton) return;

        try {
          const { button } = await import(
            `../../interactions/buttons/${interaction.customId}`
          );
          await button.execute(selbotUser, interaction);
        } catch (e) {
          console.log(e);
          interaction.reply({
            content:
              interaction.locale === 'fr'
                ? "Vous êtes perdu(e) ? Cette interaction n'existe pas, vous feriez mieux de rafraîchir votre application en utilisant `Ctrl + R` sur votre PC ou en relançant l'application sur votre téléphone."
                : 'Are you lost? This interaction does not exist. You should refresh your application by pressing `Ctrl + R` on your PC or restarting the app on your phone.',
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      if (interaction.isAnySelectMenu()) {
        const selbotUser = this.selfbotUsers.get(interaction.user.id);
        try {
          const { button } = await import(
            `../../interactions/selects/${interaction.customId}`
          );
          await button.execute(selbotUser, interaction);
        } catch (e) {
          console.log(e);
          interaction.reply({
            content:
              interaction.locale === 'fr'
                ? "Vous êtes perdu(e) ? Cette interaction n'existe pas, vous feriez mieux de rafraîchir votre application en utilisant `Ctrl + R` sur votre PC ou en relançant l'application sur votre téléphone."
                : 'Are you lost? This interaction does not exist. You should refresh your application by pressing `Ctrl + R` on your PC or restarting the app on your phone.',
            flags: MessageFlags.Ephemeral,
          });
        }
      }
      if (interaction.isModalSubmit()) {
        const selbotUser = this.selfbotUsers.get(interaction.user.id);
        try {
          const { button } = await import(
            `../../interactions/modals/${interaction.customId}`
          );
          await button.execute(selbotUser, interaction);
        } catch (e) {
          console.log(e);
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
            const selfbotUser = new SelfbotUser();

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
                  if (response === 'ALREADY_CONNECTED') return;
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

  public async initAfterLogin() {
    await Promise.all([this._initInteractions(), this._initSelfbotUsers()]);
  }

  public startAPI() {
    api();
  }

  public async login(token: string): Promise<string> {
    let response: string;

    response = await super.login(token).catch(err => {
      console.log(err);
      return 'INVALID_TOKEN';
    });

    this.user?.setActivity({
      name: `・Executing ${this.userNb} users`,
      type: ActivityType.Custom,
    });

    setInterval(
      () => {
        this.user!.setActivity({
          name: `・Executing ${this.userNb} users`,
          type: ActivityType.Custom,
        });
      },
      1000 * 60 * 2,
    );

    return response;
  }
}

export default Selfbot;
