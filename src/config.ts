import dotenv from "dotenv";
import {ConfigType} from "./types/ConfigType";

dotenv.config();

const {DISCORD_TOKEN, DISCORD_CLIENT_ID, CHAT_GPT_SECRET_KEY} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !CHAT_GPT_SECRET_KEY) {
  throw new Error("Missing environment variables");
}

export const config: ConfigType = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  CHAT_GPT_SECRET_KEY,
};
