import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {CommandType} from "../types/CommandType";
import {OpenAIServiceType} from "../types/OpenAIServiceType";
import OpenAIService from "../services/OpenAIService";

class ImageCommand implements CommandType {
  commandName = "image";
  openai: OpenAIServiceType;

  constructor() {
    this.openai = OpenAIService.getInstance();
  }

  execute = async (interaction: CommandInteraction) => {
    let response = String(interaction.options.get("prompt")?.value);
    const embeds: EmbedBuilder[] = [];
    try {
      const imagesResponse : any = await this.openai.generateImage(
        String(interaction.options.get("prompt")?.value)
      );

      imagesResponse.data.forEach((img: { revised_prompt: any; url: any; }) => {
        embeds.push(
          new EmbedBuilder()
            .setTitle(String(interaction.options.get("prompt")?.value).substring(0, 256))
            .setDescription(img.revised_prompt ?? null)
            .setImage(img.url ?? null)
        );
      });
    } catch (error) {
      console.log(error);
      // response = await this.openai.requestChat(
      //   String(interaction.options.get("prompt")?.value)
      // );
      // //response = "Oups, j'ai un soucis pour vous répondre :/";
      // await interaction.editReply(response);
    }

    await interaction.editReply({
      embeds: embeds
    });
  };

  getData = () => {
    return new SlashCommandBuilder()
      .setName(this.commandName)
      .setDescription("Replies with image!")
      .addStringOption((option) =>
        option
          .setName("prompt")
          .setDescription("The input to echo back")
          .setRequired(true)
      );
  };
}

export default ImageCommand;