import {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from 'discord.js';
import { Message } from 'discord.js-selfbot-v13';
import Selfbot from '../classes/Selfbot';
import SelfbotUser from '../classes/SelfbotUser';

export type CommandType = 'Slash' | 'Prefix' | 'Both';

export type LangType = 'en' | 'fr';

export type Select = {
  execute: (
    selfbotUser: SelfbotUser,
    interaction: AnySelectMenuInteraction,
  ) => void;
};

export type Button = {
  execute: (selfbotUser: SelfbotUser, interaction: ButtonInteraction) => void;
};

export type SlashCommand = {
  data: SlashCommandOptionsOnlyBuilder;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  execute: (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => void;
};

export type ContextMenu = {
  data: ContextMenuCommandBuilder;
  execute: (
    selfbotUser: SelfbotUser,
    interaction: ContextMenuCommandInteraction,
  ) => void;
};

export type MessageCommand = {
  execute: (
    selfbot: Selfbot,
    selfbotUser: SelfbotUser,
    message: Message,
    args: string[],
  ) => void;
};
