import { MessageFlags, time } from 'discord.js';
import selfbotUser from '../../src/classes/SelfbotUser';
import { prevnamesRequest } from '../../src/lib/prevnames';
import { MessageCommand } from '../../src/types/interactions';

interface Prevname {
    name: string;
    date: number;
    source: string;
}

export const messageCommand: MessageCommand = {
    async execute(selfbot, selfbotUser: selfbotUser, message, args: string[]) {
        const type = args[0]?.toLowerCase();

        const userId = message.mentions.users.first()?.id || selfbotUser.user!.id;
        const targetUser = await selfbotUser.users.fetch(userId).catch(() => null);
        const user = await selfbot.users.cache.get(selfbotUser.user!.id)?.fetch()!;

        const now = Math.floor(Date.now() / 1000);

        if (!targetUser) {
            await message.edit(
                selfbotUser.lang === 'fr'
                    ? `**Cette utilisateur n'existe pas ou est inaccessible! (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `prevnames <username|display> ${message.guild?.members.cache.first()?.id}\`` : '\`prevnames <username|display> [userId/userMention]\`'})**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**This user doesn't exist or is inaccessible!** (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `prevnames <username|display> ${message.guild?.members.cache.first()?.id}\`` : '\`prevnames <username|display> [userId/userMention]\`'})\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
            );
            return;
        }
        if (!type || !['username', 'display'].includes(type)) {
            await message.edit({
                content: selfbotUser.lang === 'fr'
                    ? `**Vous devez spécifier le type de nom à afficher (\`username\` ou \`display\`).** (*Exemple*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `prevnames <username|display> ${message.guild?.members.cache.first()?.id}\`` : '\`prevnames <username|display> [userId/userMention]\`'})\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**You must specify the type of name to display (\`username\` or \`display\`).** (*Example*: ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `prevnames <username|display> ${message.guild?.members.cache.first()?.id}\`` : '\`prevnames <username|display> [userId/userMention]\`'})\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
            });
            return;
        }

        const prevnames: Prevname[] = await prevnamesRequest(userId);
        if (prevnames === null) {
            await message.edit(
                selfbotUser.lang === 'fr'
                    ? `**Une erreur est survenue.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**An error occurred.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
            );
            return;
        }

        let names: Prevname[];
        switch (type) {
            case 'username':
              names = prevnames.filter(
                (name: Prevname) =>
                  name.name != '' &&
                  name.name &&
                  name.source === 'names' &&
                  name.date,
              );
      
              break;
            case 'display':
            default:
              names = prevnames.filter(
                (name: Prevname) =>
                  name.name != '' &&
                  name.name &&
                  name.source === 'display' &&
                  name.date,
              );
              break;
          }

        const itemsPerPage = 10;
        let currentPage = 1;

        const generateEmbed = async (page: number, names: Prevname[]) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const namesList = names.slice(start, end);

            const namesString = namesList.length > 0
                ? namesList
                    .map(
                        (name: Prevname, index: number) =>
                            `> ${start + index + 1}. **\`${name.name
                            }\`** — <t:${Math.floor(
                                new Date(name.date * 1000).getTime() / 1000
                            )}:R>`
                    )
                    .filter(Boolean)
                    .join("\n")
                : selfbotUser.lang === "fr"
                    ? `Aucun résultat trouvé.`
                    : `No results found.`

            const messageOptions = {
                type: 17,
                accent_color: null,
                spoiler: false,
                components: [
                    {
                        type: 10,
                        content: namesString,
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
                                    id: "1366064859258556446",
                                },
                                disabled: page === 1,
                                custom_id: "previous"
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
                                    id: "1366064861548642425",
                                },
                                disabled: page === totalPages,
                                custom_id: "next"
                            }
                        ]
                    },
                    {
                        type: 14,
                        divider: true,
                        spacing: 1,
                    },
                ] as any
            };
            return messageOptions;
        };
        const totalPages = Math.max(1, Math.ceil(names.length / itemsPerPage))
        let embed = await generateEmbed(currentPage, names)


        const msg = await user!.send({
            flags: MessageFlags.IsComponentsV2,
            components: [embed!],
        }).catch((err) => console.log(err));

        if (!msg) {
            await message.edit(
                selfbotUser.lang === 'fr'
                    ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
            );
            return;
        }
        await message.edit({
            content: selfbotUser.lang === 'fr'
                ? `**Vous pouvez voir la liste des noms précédents dans vos MPs.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                : `**You can view the list of previous names in your DMs.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`,
        });
        if (totalPages > 1) {
            const collector = msg.createMessageComponentCollector({
                time: 1000 * 60 * 2,
            });

            collector.on("collect", async (i) => {
                if (i.customId === "previous") {
                    currentPage--;
                } else if (i.customId === "next") {
                    currentPage++;
                }

                embed = await generateEmbed(currentPage, names);

                await i.update({ components: [embed] })

            }
            );
            collector.on("end", async () => {
                await msg.delete().catch(() => null);
            }
            );
            return;
        }
        return;
    },
};
