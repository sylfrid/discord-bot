import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {CommandType} from "../types/CommandType";
import OpenAIService from "../services/OpenAIService";
import {OpenAIServiceType} from "../types/OpenAPIServiceType";

class ChatCommand implements CommandType {
  commandName = "gpt";
  openai: OpenAIServiceType;

  constructor() {
    this.openai = OpenAIService.getInstance();
  }

  execute = async (interaction: CommandInteraction) => {
    console.log("execute command : /" + this.commandName);
    let response: string;
    try {
      response = await this.openai.requestChat(
        String(interaction.options.get("message")?.value),
        interaction.user.displayName
      );
    } catch (error) {
      console.log(error);
      response = "Oups, j'ai un soucis pour vous répondre :/";
    }
    console.log("request openai OK");

    await interaction.editReply(response);
  };

  getData = () => {
    return new SlashCommandBuilder()
      .setName(this.commandName)
      .setDescription("Replies with ChatGPT")
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription("Your message to ChatGPT")
          .setRequired(true)
      );
  };
}

export default ChatCommand;