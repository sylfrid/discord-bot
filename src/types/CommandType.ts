import {CommandInteraction, SlashCommandBuilder} from "discord.js";

interface CommandType {
  commandName: string;
  execute: (interaction: CommandInteraction) => Promise<void>;
  getData: () => Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
}

export type {CommandType};