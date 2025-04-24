import {
  ChatInputCommandInteraction,
  Role,
  roleMention,
  SlashCommandBuilder,
  time,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import { UserData } from '../../src/types/user';
import { replyNewComponents } from '../../src/util/replyNewComponents';

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user')
    .setDescriptionLocalization(
      'fr',
      "Permet d'obtenir des informations sur un utilisateur",
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user to get information about')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur dont vous voulez voir les informations",
        )
        .setRequired(false),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    const mutuals: UserData = await fetch(
      `https://discord.com/api/v9/users/${targetUser.id}/profile?with_mutual_guilds=true&with_mutual_friends=true`,
      {
        headers: {
          Authorization: selfbotUser.token!,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(r => r.json())
      .catch(() => ({}));

    let guild = null;
    let member: any = await selfbotUser.users.cache.get(targetUser.id)?.fetch();
    if (interaction.guildId) {
      guild = await selfbotUser.guilds
        .fetch(interaction.guildId)
        .catch(() => null);
      member = guild
        ? await guild.members.fetch(targetUser.id).catch(() => null)
        : null;
    }
    if (!member) {
      await interaction.reply({
        content:
          selfbotUser.lang === 'fr'
            ? `**Utilisateur introuvable!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : `**User not found!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
        ephemeral: true,
      });
      return;
    }

    const roles = member
      ? member.roles.cache.map((r: Role) => roleMention(r.id)).join(', ')
      : '`N/A`';
    const userBanner = await targetUser
      .fetch()
      .then(u => u.bannerURL({ size: 1024 }));
    const flags = targetUser.flags?.toArray() ?? [];
    const badges =
      flags.length > 0
        ? flags
            .map((flag: string) => {
              switch (flag) {
                case 'Staff':
                  return '`Discord Employee`';
                case 'Partner':
                  return '`Discord Partner`';
                case 'Hypesquad':
                  return '`HypeSquad Events`';
                case 'BugHunterLevel1':
                  return '`Bug Hunter Level 1`';
                case 'HypeSquadOnlineHouse1':
                  return '`HypeSquad Bravery`';
                case 'HypeSquadOnlineHouse2':
                  return '`HypeSquad Brilliance`';
                case 'HypeSquadOnlineHouse3':
                  return '`HypeSquad Balance`';
                case 'PremiumEarlySupporter':
                  return '`Early Supporter`';
                case 'TeamPseudoUser':
                  return '`Team User`';
                case 'BugHunterLevel2':
                  return '`Bug Hunter Level 2`';
                case 'VerifiedBot':
                  return '`Verified Bot`';
                case 'VerifiedDeveloper':
                  return '`Early Verified Bot Developer`';
                case 'CertifiedModerator':
                  return '`Discord Certified Moderator`';
                case 'BotHTTPInteractions':
                  return '`HTTP Interactions Bot`';
                case 'ActiveDeveloper':
                  return '`Active Developer`';
                default:
                  return `\`${flag}\``;
              }
            })
            .join(', ')
        : selfbotUser.lang === 'fr'
          ? '`Aucun`'
          : '`None`';

    await replyNewComponents(interaction.id, interaction.token, [
      {
        type: 17,
        accent_color: null,
        spoiler: false,
        components: [
          ...(userBanner
            ? [
                {
                  type: 12,
                  items: [
                    {
                      media: {
                        url: userBanner,
                      },
                      description: null,
                      spoiler: false,
                    },
                  ],
                },
              ]
            : []),
          {
            type: 9,
            accessory: {
              type: 11,
              media: {
                url: targetUser.displayAvatarURL({ size: 4096 }),
              },
            },
            components: [
              {
                type: 10,
                content: [
                  `**ID:** \`${targetUser.id}\``,
                  `**${selfbotUser.lang === 'fr' ? 'Badges' : 'Badges'}:** **${badges}**`,
                  `**${selfbotUser.lang === 'fr' ? 'Nitro' : 'Nitro'}:** **${
                    mutuals.premium_type === 3
                      ? '`Nitro Basic`'
                      : mutuals.premium_type === 2
                        ? '`Nitro Boost`'
                        : '`❌`'
                  }**`,
                  `**${selfbotUser.lang === 'fr' ? 'Nitro depuis' : 'Nitro since'}:** ${mutuals.premium_since ? time(Math.floor(mutuals.premium_since.getTime() / 1000)) : '`❌`'}`,
                ]
                  .filter(Boolean)
                  .join('\n'),
              },
              {
                type: 10,
                content: [
                  `**${selfbotUser.lang === 'fr' ? "Nom d'utilisateur" : 'Username'}:** **\`${targetUser.username}\`**`,
                  `**${selfbotUser.lang === 'fr' ? 'Date de création' : 'Created at'}:** ${time(Math.floor(targetUser.createdAt.getTime() / 1000))}`,
                  ...(!member.bot
                    ? [
                        `**${selfbotUser.lang === 'fr' ? 'Serveurs en commun' : 'Mutual Servers'}:** ${mutuals.mutual_guilds?.length}`,
                        `**${selfbotUser.lang === 'fr' ? 'Amis en commun' : 'Mutual Friends'}:** ${mutuals.mutual_friends?.length}`,
                      ]
                    : []),
                  `**${selfbotUser.lang === 'fr' ? 'Pronoms' : 'Pronouns'}:** \`${mutuals.user_profile.pronouns || '`N/A`'}\``,
                ]
                  .filter(Boolean)
                  .join('\n'),
              },
            ],
          },
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label:
                  selfbotUser.lang === 'fr' ? "URL de l'avatar" : 'Avatar URL',
                emoji: null,
                disabled: false,
                url: targetUser.displayAvatarURL({ size: 4096 }),
              },
              ...(userBanner
                ? [
                    {
                      type: 2,
                      style: 5,
                      label:
                        selfbotUser.lang === 'fr'
                          ? 'URL de la bannière'
                          : 'Banner URL',
                      emoji: null,
                      disabled: false,
                      url: userBanner,
                    },
                  ]
                : []),
            ],
          },
          {
            type: 14,
            divider: true,
            spacing: 2,
          },
          ...(guild
            ? [
                {
                  type: 9,
                  accessory: {
                    type: 11,
                    media: {
                      url:
                        guild.iconURL({ size: 4096 }) ||
                        guild.splashURL({ size: 4096 }) ||
                        guild.bannerURL({ size: 4096 }) ||
                        guild.discoverySplashURL({ size: 4096 }),
                    },
                    description: null,
                    spoiler: false,
                  },
                  components: [
                    {
                      type: 10,
                      content: [
                        `## ${selfbotUser.lang === 'fr' ? "Informations de l'utilisateur sur le serveur" : 'User information on server'}`,
                        `**${selfbotUser.lang === 'fr' ? 'Serveur' : 'Server'}:** \`${guild.name}\``,
                        `**${selfbotUser.lang === 'fr' ? 'Rôles' : 'Roles'}:** ${roles}`,
                        `**${selfbotUser.lang === 'fr' ? "Date d'arrivée" : 'Joined at'}:** ${time(Math.floor(member?.joinedAt?.getTime()! / 1000))}`,
                      ].join('\n'),
                    },
                  ],
                },
              ]
            : []),
        ],
      },
    ]);
  },
};
