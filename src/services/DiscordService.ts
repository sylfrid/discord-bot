import { Client, REST, Routes } from "discord.js";
import { ConfigType } from "../types/ConfigType";
import { DiscordServiceType } from "../types/DiscordServiceType";
import { CommandType } from "../types/CommandType";
import { Snowflake } from "discord-api-types/globals";
import ChatService from "./ChatService";

class DiscordService implements DiscordServiceType {
  client: Client;
  token: string;
  clientId: string;

  channelConversations = new Map<string, ChatService>();

  constructor(config: ConfigType) {
    this.client = new Client({
      intents: ["Guilds", "GuildMessages", "DirectMessages"],
    });
    this.token = config.DISCORD_TOKEN;
    this.clientId = config.DISCORD_CLIENT_ID;
  }

  init = async (commands: CommandType[]) => {
    this.client.once("ready", () => {
      console.log("Discord bot is ready! 🤖");
    });

    this.client.on("guildCreate", async (guild) => {
      await this.deployCommands(guild.id, commands);
    });

    this.client.on("interactionCreate", async (interaction) => {
      console.log(interaction);
      if (!interaction.isCommand()) {
        return;
      }

      const command = commands.find((cmd) => {
        return cmd.commandName == interaction.commandName;
      });
      if (command == undefined) {
        console.log("received unknow command : " + interaction.commandName);
        return;
      }
      console.log("request command : /" + interaction.commandName);
      interaction.deferReply({ ephemeral: true });
      await command.execute(interaction);
    });

    this.client.on("messageCreate", async (message) => {
      console.log(message);
      if ((this.client.user !== null &&
        !message.content.includes(this.client.user.id)) ||
        message.author.bot
      ) {
        return;
      }
      message.channel.sendTyping();
      console.log(message.channelId);
      const chatService = await this.getChatService(message.channelId);
      if (chatService !== undefined) {
        message.channel.send(
          await chatService.requestChat(this.cleanMessage(message.content))
        );
      }
    });

    await this.client.login(this.token);
  };

  getChatService = (channelId: string) => {
    if (!this.channelConversations.has(channelId)) {
      if (this.client.user !== null) {
        this.channelConversations.set(
          channelId,
          ChatService.getInstance(channelId, this.client.user.username)
        );
      }
    }
    const chatService = this.channelConversations.get(channelId);
    if (chatService === undefined) {
      console.error("ChatService unavailable");
      return;
    }
    return this.channelConversations.get(channelId);
  };

  cleanMessage = (message: string): string => {
    if (this.client.user === null) {
      return message;
    }
    return message.replace(
      `<@${this.client?.user?.id}>`,
      this.client?.user.username
    );
  };

  deployCommands = async (guildId: string, commands: CommandType[]) => {
    const commandsData = Object.values(commands).map((command) =>
      command.getData()
    );
    console.log(commandsData);
    const rest = new REST({ version: "10" }).setToken(this.token);

    try {
      console.log("Started refreshing application (/) commands.");
      console.log(guildId);

      await rest.put(
        Routes.applicationGuildCommands(
          this.clientId as Snowflake,
          guildId as Snowflake
        ),
        {
          body: commandsData,
        }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  };
}

export default DiscordService;
