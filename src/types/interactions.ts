import {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  SlashCommandOptionsOnlyBuilder,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { Message } from 'discord.js-selfbot-v13';
import Selfbot from '../classes/Selfbot';
import SelfbotUser from '../classes/SelfbotUser';

export type Select = {
  execute: (
    selfbotUser: SelfbotUser,
    interaction: AnySelectMenuInteraction,
  ) => void;
};

export type Button = {
  execute: (selfbotUser: SelfbotUser, interaction: ButtonInteraction) => void;
};

export type Modal = {
  execute: (
    selfbotUser: SelfbotUser,
    interaction: ModalSubmitInteraction,
  ) => void;
};

export type SlashCommand = {
  data: SlashCommandOptionsOnlyBuilder;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  execute: (
    selfbotUser: SelfbotUser,
    interaction: ChatInputCommandInteraction,
  ) => void;
};

export type ContextCommand<
  T extends
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction =
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction,
> = {
  data: ContextMenuCommandBuilder;
  execute: (selfbotUser: SelfbotUser, interaction: T) => Promise<void>;
};

export type MessageCommand = {
  execute: (
    selfbot: Selfbot,
    selfbotUser: SelfbotUser,
    message: Message,
    args: string[],
  ) => void;
};
