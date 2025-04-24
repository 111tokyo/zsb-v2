import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';
import { UserData } from '../../src/types/user';
import { sendNewComponents } from '../../src/util/sendNewComponents';

export const messageCommand: MessageCommand = {
  async execute(selfbot, selfbotUser, message, args: string[]) {
    const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch();

    const targetId = args[0]?.replace(/[<@!>]/g, '') || message.author.id;
    const targetUser = await selfbot.users.cache.get(targetId)?.fetch();

    if (!targetUser) {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Utilisateur non trouvé!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**User not found!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      return;
    }

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

    const member = message.guild
      ? await message.guild.members.fetch(targetId).catch(() => null)
      : null;
    const roles = member
      ? member.roles.cache.map(r => r.name).join(', ')
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

    const msg = await sendNewComponents(
      user!.id,
      [
        [
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
                      ...(!member?.user.bot
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
                    label: 'Avatar UrL',
                    emoji: null,
                    disabled: false,
                    url: targetUser.displayAvatarURL({ size: 4096 }),
                  },
                  ...(userBanner
                    ? [
                        {
                          type: 2,
                          style: 5,
                          label: 'Banner UrL',
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
              ...(message.guild
                ? [
                    {
                      type: 9,
                      accessory: {
                        type: 11,
                        media: {
                          url:
                            message.guild.iconURL({ size: 4096 }) ||
                            message.guild.splashURL({ size: 4096 }) ||
                            message.guild.bannerURL({ size: 4096 }) ||
                            message.guild.discoverySplashURL({ size: 4096 }),
                        },
                        description: null,
                        spoiler: false,
                      },
                      components: [
                        {
                          type: 10,
                          content: [
                            `**${selfbotUser.lang === 'fr' ? 'Serveur' : 'Server'}:** \`${message.guild.name}\``,
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
        ],
      ],
      user!.id,
      1000 * 60 * 2,
    );

    if (msg === 'CLOSED_DMS') {
      await message.edit(
        selfbotUser.lang === 'fr'
          ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
          : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
      );
      return;
    }

    await message.edit(
      selfbotUser.lang === 'fr'
        ? `**Vous pouvez voir les informations depuis vos DMs.**\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
        : `**You can view the information in your DMs.**\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
    );
  },
};
