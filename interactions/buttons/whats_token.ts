import { MessageFlags } from 'discord.js';
import { Button } from '../../src/types/interactions';

export const button: Button = {
  execute: async (selfbotUser, interaction) => {
    interaction.reply({
      content:
        selfbotUser.lang === 'fr'
          ? "Un token est une clé d'authentification qui vous permet de vous connecter à Discord sans avoir à entrer votre mot de passe. Il est utilisé par les bots et les selfbots pour accéder à l'API de Discord. Nous vous recommandons de ne pas partager votre token avec qui que ce soit, car cela pourrait compromettre la sécurité de votre compte et des assaillants pourraient s'en servir pour vous voler votre compte Discord."
          : 'A token is an authentication key that allows you to log in to Discord without having to enter your password. It is used by bots and selfbots to access the Discord API. We recommend that you do not share your token with anyone, as this could compromise the security of your account and attackers could use it to steal your Discord account.',
      flags: MessageFlags.Ephemeral,
    });
  },
};
