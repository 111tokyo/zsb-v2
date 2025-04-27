import { time } from 'discord.js';
import { MessageCommand } from '../../src/types/interactions';

export const messageCommand: MessageCommand = {
    async execute(selfbot, selfbotUser, message, _args: string[]) {
        const commands = selfbot.messageCommandInteraction
            ? Array.from(selfbot.messageCommandInteraction.keys())
            .map(cmdName => {
                return `> **\`${selfbotUser.prefix}\`**${cmdName}`;
            })
            .join('\n')
            : selfbotUser.lang === 'fr'
            ? '> Aucune commande de message trouvée.'
            : '> No message command found.';

        message.edit({
            content: selfbotUser.lang === 'fr'
            ? '> Voici la liste des commandes disponibles :\n' + commands + `\n-# ➜ *Suppression du message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`
            : '> Here is the list of available commands:\n' + commands  + `\n-# ➜ *Deleting message ${time(Math.floor(Date.now() / 1000) + 16, 'R')}*`,
        });
    },
};
