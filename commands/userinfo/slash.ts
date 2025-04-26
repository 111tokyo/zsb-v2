import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  time,
} from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';
import { UserData } from '../../src/types/user';

const BADGE_MAPPINGS = {
  Staff: 'Discord Employee',
  Partner: 'Discord Partner',
  Hypesquad: 'HypeSquad Events',
  BugHunterLevel1: 'Bug Hunter Level 1',
  HypeSquadOnlineHouse1: 'HypeSquad Bravery',
  HypeSquadOnlineHouse2: 'HypeSquad Brilliance',
  HypeSquadOnlineHouse3: 'HypeSquad Balance',
  PremiumEarlySupporter: 'Early Supporter',
  TeamPseudoUser: 'Team User',
  BugHunterLevel2: 'Bug Hunter Level 2',
  VerifiedBot: 'Verified Bot',
  VerifiedDeveloper: 'Early Verified Bot Developer',
  CertifiedModerator: 'Discord Certified Moderator',
  BotHTTPInteractions: 'HTTP Interactions Bot',
  ActiveDeveloper: 'Active Developer',
} as const;

export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Allows you to get the informations about a user')
    .setDescriptionLocalization(
      'fr',
      "Permet d'obtenir les informations d'un utilisateur",
    )
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The user you want to get information about')
        .setDescriptionLocalization(
          'fr',
          "L'utilisateur dont vous souhaitez voir les informations",
        )
        .setRequired(false),
    ),

  execute: async (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    const [mutuals] = await Promise.all([
      fetch(
        `https://discord.com/api/v9/users/${targetUser.id}/profile?with_mutual_guilds=true&with_mutual_friends=true`,
        {
          headers: {
            Authorization: selfbotUser.token!,
            'Content-Type': 'application/json',
          },
        },
      )
        .then(async r => {
          if (!r.ok) return {} as UserData;
          const data: UserData = await r.json();
          return data;
        })
        .catch(() => ({}) as UserData),

      interaction.guildId
        ? selfbotUser.guilds.fetch(interaction.guildId).catch(() => null)
        : null,

      selfbotUser.users.fetch(targetUser.id).catch(() => null),
    ]);

    const [userBanner, flags] = await Promise.all([
      targetUser
        .fetch()
        .then(u => u.bannerURL({ size: 1024 }))
        .catch(() => null),
      targetUser.flags?.toArray() ?? [],
    ]);

    const badges =
      flags.length > 0
        ? flags
            .map(
              flag =>
                `\`${BADGE_MAPPINGS[flag as keyof typeof BADGE_MAPPINGS] || flag}\``,
            )
            .join(', ')
        : `\`${selfbotUser.lang === 'fr' ? 'Aucun' : 'None'}\``;

    await interaction.reply({
      flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
      components: [
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
                      (mutuals?.premium_type ?? 0) === 3
                        ? '`Nitro Basic`'
                        : (mutuals?.premium_type ?? 0) === 2
                          ? '`Nitro Boost`'
                          : '`❌`'
                    }**`,
                    `**${selfbotUser.lang === 'fr' ? 'Nitro depuis' : 'Nitro since'}:** ${mutuals?.premium_since ? time(new Date(mutuals.premium_since)) : '`❌`'}`,
                  ]
                    .filter(Boolean)
                    .join('\n'),
                },
                {
                  type: 10,
                  content: [
                    `**${selfbotUser.lang === 'fr' ? "Nom d'utilisateur" : 'Username'}:** **\`${targetUser.username}\`**`,
                    `**${selfbotUser.lang === 'fr' ? 'Date de création' : 'Created at'}:** ${time(Math.floor(targetUser.createdAt.getTime() / 1000))}`,
                    ...(targetUser.id !== selfbotUser.user!.id
                      ? [
                          `**${selfbotUser.lang === 'fr' ? 'Serveurs en commun' : 'Mutual Servers'}:** **\`${mutuals?.mutual_guilds?.length ?? 0}\`**`,
                          `**${selfbotUser.lang === 'fr' ? 'Amis en commun' : 'Mutual Friends'}:** **\`${mutuals?.mutual_friends?.length ?? 0}\`**`,
                        ]
                      : []),
                    `**${selfbotUser.lang === 'fr' ? 'Pronoms' : 'Pronouns'}:** **\`${mutuals?.user_profile?.pronouns || 'N/A'}\`**`,
                  ]
                    .filter(Boolean)
                    .join('\n'),
                },
              ],
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
                  style: 5,
                  label:
                    selfbotUser.lang === 'fr'
                      ? "URL de l'avatar"
                      : 'Avatar URL',
                  emoji: {
                    id: '1365681835807608832',
                  },
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
                        emoji: {
                          id: '1365681835807608832',
                        },
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
          ],
        },
      ] as any,
    });
  },
};
