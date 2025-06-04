import { ChatInputCommandInteraction, MessageFlags, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import SelfbotUser from '../../src/classes/SelfbotUser';
import { SlashCommand } from '../../src/types/interactions';

export const slashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulse un utilisateur du serveur')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur à expulser')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('La raison de l\'expulsion')
                .setRequired(false)),
    execute: async (selfbotUser: SelfbotUser, interaction: ChatInputCommandInteraction) => {
        const guild = await selfbotUser.guilds.cache.get(interaction.guildId!)?.fetch();
        const member = await guild?.members.fetch(interaction.user.id);
        const user = await guild?.members.fetch(interaction.options.getUser('user')!.id)!;
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if(!member?.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous n'avez pas les permissions pour expulsé un utilisateur!**` : `**You do not have permission to kick a user!**`, flags: MessageFlags.Ephemeral });
            return;
        }

        if(user.roles.highest.position >= member.roles.highest.position) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous ne pouvez pas expulsé un utilisateur qui a une rôle plus haut ou égal à votre rôle!**` : `**You cannot kick a user who has a role higher or equal to your role!**`, flags: MessageFlags.Ephemeral });
            return;
        }
        if(user.id === interaction.user.id) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous ne pouvez pas expulsé vous-même!**` : `**You cannot kick yourself!**`, flags: MessageFlags.Ephemeral });
            return;
        }
        if(user.id ===  guild?.ownerId) {
            await interaction.reply({ content: selfbotUser.lang === 'fr' ? `**Vous ne pouvez pas expulsé le propriétaire du serveur!**` : `**You cannot kick the server owner!**`, flags: MessageFlags.Ephemeral });
            return;
        }
        
        await guild?.members.kick(user, reason);
        await interaction.reply({ content: selfbotUser.lang === 'fr' ? `L'utilisateur ${user} a été expulsé avec succès!` : `The user ${user} has been kicked successfully!`, flags: MessageFlags.Ephemeral });
        
    },
}; 