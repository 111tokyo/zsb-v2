import { MessageFlags, time } from 'discord.js';
import selfbotUser from '../../src/classes/SelfbotUser';
import { prevnamesRequest } from '../../src/lib/prevnames';
import { MessageCommand } from '../../src/types/interactions';


export const messageCommand: MessageCommand = {
    async execute(selfbot, selfbotUser: selfbotUser, message, args: string[]) {
        const type = args[0]?.toLowerCase();
        const now = Math.floor(Date.now() / 1000);
        const userId = message.mentions.users.first()?.id || selfbotUser.user!.id;

        const prevnames = await prevnamesRequest(userId);
        if (!prevnames) {
            await message.edit(
                selfbotUser.lang === 'fr'
                    ? `**L'API est actuellement indisponible.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**The API is currently unavailable.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`
            );
            return;
        }

        const [targetUser, user] = await Promise.all([
            selfbotUser.users.fetch(userId).catch(() => null),
            selfbot.users.cache.get(selfbotUser.user!.id)?.fetch()
        ]);

        if (!targetUser) {
            const example = message.guild?.members.cache.first()?.id
                ? `\`${selfbotUser.prefix}prevnames <username|display> ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `prevnames <username|display> ${message.guild?.members.cache.first()?.id}\`` : '\`prevnames <username|display> [userId/userMention]\`'}`
                : '`prevnames <username|display> [userId/userMention]`';

            await message.edit(
                selfbotUser.lang === 'fr'
                    ? `**Cette utilisateur n'existe pas ou est inaccessible! (*Exemple*: ${example})**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**This user doesn't exist or is inaccessible!** (*Exemple*: ${example})\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`
            );
            return;
        }

        if (!type || !['username', 'display'].includes(type)) {
            const example = message.guild?.members.cache.first()?.id
                ? `\`${selfbotUser.prefix}prevnames <username|display> ${message.guild?.members.cache.first() ? '\`' + selfbotUser.prefix + `prevnames <username|display> ${message.guild?.members.cache.first()?.id}\`` : '\`prevnames <username|display> [userId/userMention]\`'}\``
                : '`prevnames <username|display> [userId/userMention]`';

            await message.edit({
                content: selfbotUser.lang === 'fr'
                    ? `**Vous devez spécifier le type de nom à afficher (\`username\` ou \`display\`).** (*Exemple*: ${example})\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**You must specify the type of name to display (\`username\` or \`display\`).** (*Example*: ${example})\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`
            });
            return;
        }


        const names = prevnames.filter(name =>
            name.name &&
            name.date &&
            name.source === (type === 'username' ? 'names' : 'display')
        );

        const itemsPerPage = 10;
        let currentPage = 1;
        const totalPages = Math.max(1, Math.ceil(names.length / itemsPerPage));

        const generateEmbed = (page: number) => {
            const start = (page - 1) * itemsPerPage;
            const namesList = names.slice(start, start + itemsPerPage);

            const namesString = namesList.length > 0
                ? namesList
                    .map((name, index) =>
                        `> ${start + index + 1}. **\`${name.name}\`** — <t:${Math.floor(name.date)}:R>`
                    )
                    .join("\n")
                : selfbotUser.lang === "fr" ? `Aucun résultat trouvé.` : `No results found.`;

            return {
                type: 17,
                accent_color: null,
                spoiler: false,
                components: [
                    { type: 10, content: namesString },
                    { type: 14, divider: true, spacing: 1 },
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 2,
                                emoji: { id: "1366064859258556446" },
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
                                emoji: { id: "1366064861548642425" },
                                disabled: page === totalPages,
                                custom_id: "next"
                            }
                        ]
                    },
                    { type: 14, divider: true, spacing: 1 },
                ]
            };
        };

        const embed = generateEmbed(currentPage);
        const msg = await user?.send({
            flags: MessageFlags.IsComponentsV2,
            components: [embed],
        }).catch(console.log);

        if (!msg) {
            await message.edit(
                selfbotUser.lang === 'fr'
                    ? `**Vous devez ouvrir vos messages privés pour utiliser cette fonctionnalité!**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                    : `**You must enable your private messages to use this feature!**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`
            );
            return;
        }

        await message.edit({
            content: selfbotUser.lang === 'fr'
                ? `**Vous pouvez voir la liste des noms précédents dans vos MPs.**\n-# ➜ *Suppression du message ${time(now + 16, 'R')}*`
                : `**You can view the list of previous names in your DMs.**\n-# ➜ *Deleting message ${time(now + 16, 'R')}*`
        });

        if (totalPages > 1) {
            const collector = msg.createMessageComponentCollector({ time: 120000 });

            collector.on("collect", async (i) => {
                currentPage = i.customId === "previous" ? currentPage - 1 : currentPage + 1;
                await i.update({ components: [generateEmbed(currentPage)] });
            });

            collector.on("end", () => msg.delete().catch(() => null));
        }
    },
};
