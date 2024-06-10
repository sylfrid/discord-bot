import {config} from "./config";
import DiscordService from "./services/DiscordService";
import {commands} from "./commands";


const discordService = new DiscordService(config);
discordService.init(commands).then(() => console.log("Discord service initialized"));
