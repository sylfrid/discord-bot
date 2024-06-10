import {CommandInteraction, SlashCommandBuilder} from "discord.js";

interface CommandType {
  commandName: string;
  execute: (interaction: CommandInteraction) => Promise<void>;
  getData: () => any;
}

export type {CommandType};