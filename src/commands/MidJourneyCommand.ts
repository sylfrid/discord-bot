import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { CommandType } from "../types/CommandType";
import MidJourneyService from "../services/MidJourneyService";

class MidJourneyCommand implements CommandType {
  commandName = "imagine_me";
  mjService: MidJourneyService;

  constructor() {
    this.mjService = MidJourneyService.getInstance();
  }

  execute = async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    const prompt = interaction.options.getString("prompt");
    if (prompt === null) {
      return;
    }

    this.mjService.midJourney.config.ChannelId = interaction.channelId;
    const httpStatus = await this.mjService.midJourney.MJApi.ImagineApi(prompt);
    if (httpStatus !== 204) {
      await interaction.editReply("Request has failed; please try later");
    } else {
      await interaction.editReply(
        "Your image is being prepared, please wait a moment..."
      );
    }
  };

  getData = () => {
    return new SlashCommandBuilder()
      .setName(this.commandName)
      .setDescription("Replies with MidJourney generation !")
      .addStringOption((option) =>
        option
          .setName("prompt")
          .setDescription("Your prompt request to MidJourney")
          .setRequired(true)
      );
  };
}

export default MidJourneyCommand;
