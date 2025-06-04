import { ChatInputCommandInteraction, MessageFlags, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un utilisateur du serveur')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur à bannir')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('La raison du bannissement')
                .setRequired(false)),
    execute: async (selfbotUser: SelfbotUser, interaction: ChatInputCommandInteraction) => {
        const guild = await selfbotUser.guilds.cache.get(interaction.guildId!)?.fetch();
        const member = await guild?.members.fetch(interaction.user.id);
        const user = await guild?.members.fetch(interaction.options.getUser('user')!.id)!;
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if(!member?.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous n'avez pas les permissions pour bannir un utilisateur!**` : `**You do not have permission to ban a user!**`, flags: MessageFlags.Ephemeral });
            return;
        }

        if(user.roles.highest.position >= member.roles.highest.position) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous ne pouvez pas bannir un utilisateur qui a une rôle plus haut ou égal à votre rôle!**` : `**You cannot ban a user who has a role higher or equal to your role!**`, flags: MessageFlags.Ephemeral });
            return;
        }
        if(user.id === interaction.user.id) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous ne pouvez pas vous bannir vous-même!**` : `**You cannot ban yourself!**`, flags: MessageFlags.Ephemeral });
            return;
        }
        if(user.id ===  guild?.ownerId) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous ne pouvez pas bannir le propriétaire du serveur!**` : `**You cannot ban the server owner!**`, flags: MessageFlags.Ephemeral });
            return;
        }
        
        await guild?.members.ban(user, { reason });
        await interaction.reply({ content: selfbotUser.lang === 'fr' ? `L'utilisateur ${user} a été banni avec succès!` : `The user ${user} has been banned successfully!`, flags: MessageFlags.Ephemeral });
        
    },
}; 