import { MessageFlags, time } from 'discord.js';
import { MessageCommand, SlashCommand } from '../../src/types/interactions';

const COMMANDS_PER_PAGE = 15;

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, _args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch()!;
    const now = Math.floor(Date.now() / 1000);
    const prefixCommands = Array.from(selfbot.messageCommandInteraction.keys());
      
    const allCommandsFR = Array.from(
      selfbot.slashCommandInteraction.values(),
    ).map((cmdName: SlashCommand) => {
      if (prefixCommands.includes(cmdName.data.name)) {
        return (
          `- **\`${cmdName.data.name}` +
          (cmdName.data.options && cmdName.data.options.length
        ? ' ' +
          cmdName.data.options
            .map((o: any) => (o.required ? `[${o.name}]` : `<${o.name}>`))
            .join(' ')
        : '') +
          '\`**\n' +
          `-# ┖ ${cmdName.data.description_localizations?.fr}`
        );
      }
      return;
        }).filter(Boolean);
        
        const allCommandsEN = Array.from(
      selfbot.slashCommandInteraction.values(),
    ).map((cmdName: SlashCommand) => {
      if (prefixCommands.includes(cmdName.data.name)) {
        return (
          `- **\`${selfbotUser.prefix}${cmdName.data.name}` +
          (cmdName.data.options && cmdName.data.options.length
            ? ' ' +
            cmdName.data.options
              .map((o: any) => (o.required ? `[${o.name}]` : `<${o.name}>`))
              .join(' ')
          : '') +
        '\`**\n' +
        `-# ┖ ${cmdName.data.description}`
      );
    }
      return;
    }).filter(Boolean);
    let currentPage = 1;
    const commands = selfbotUser.lang === 'fr' ? allCommandsFR : allCommandsEN;
    const totalPages = Math.max(
      1,
      Math.ceil(commands.length / COMMANDS_PER_PAGE),
    );

    const header =
      selfbotUser.lang === 'fr'
        ? `Les options mises entre \`<...>\` sont obligatoires, contrairement aux options mis entre \`[...]\` qui sont facultatives.\n`
        : `Options enclosed in \`<...>\` are mandatory, unlike options enclosed in \`[...]\`, which are optional.\n\n`;

    const getPageContent = (page: number) => {
      const start = (page - 1) * COMMANDS_PER_PAGE;
      const pageCommands = commands.slice(start, start + COMMANDS_PER_PAGE);
      return pageCommands.join('\n');
    };

    const getComponents = (page: number) =>
      [
        {
          type: 17,
          accent_color: null,
          spoiler: false,
          components: [
            {
              type: 10,
              content: header,
            },
            {
              type: 14,
              divider: true,
              spacing: 1,
            },
            {
              type: 10,
              content: getPageContent(page),
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
                  type: 2,
                  style: 2,
                  emoji: {
                    id: '1366064859258556446',
                  },
                  disabled: page === 1,
                  custom_id: 'help_back',
                },
                {
                  type: 2,
                  style: 2,
                  label: `${page}/${totalPages}`,
                  emoji: null,
                  disabled: true,
                  custom_id: 'page_indicator',
                },
                {
                  type: 2,
                  style: 2,
                  emoji: {
                    id: '1366064861548642425',
                  },
                  disabled: page === totalPages,
                  custom_id: 'help_next',
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
      ] as any;

    const msg = await user
      .send({
        flags: MessageFlags.IsComponentsV2,
        components: getComponents(currentPage),
      })
      .catch((e) => console.log(e));

    if (!msg) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
          : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
      );
      return;
    }

    const collector = msg.createMessageComponentCollector({
      time: 1000 * 60 * 2,
    });

    collector.on('collect', async interaction => {
      if (interaction.customId === 'help_back' && currentPage > 1) {
        currentPage--;
      } else if (
        interaction.customId === 'help_next' &&
        currentPage < totalPages
      ) {
        currentPage++;
      }

      await interaction.update({
        components: getComponents(currentPage),
      });
    });

    collector.on('end', () => {
      msg.delete().catch(() => null);
    });

    await message.edit(
      selfbotUser.lang === 'fr'
        ? `**Vous pouvez voir la documentation dans vos MPs.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
        : `**You can view the documentation in your DMs.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
    );
  },
};
