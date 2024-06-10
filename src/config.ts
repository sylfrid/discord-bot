import dotenv from "dotenv";
import { ConfigType } from "./types/ConfigType";

dotenv.config();

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_SALAI_TOKEN,
  CHAT_GPT_SECRET_KEY,
  REDIS_URL,
  MJBOT_SERVER_ID,
  MJBOT_CHANNEL_ID
} =
  process.env;

if (
  !DISCORD_TOKEN ||
  !DISCORD_CLIENT_ID ||
  !DISCORD_SALAI_TOKEN ||
  !CHAT_GPT_SECRET_KEY ||
  !REDIS_URL ||
  !MJBOT_SERVER_ID ||
  !MJBOT_CHANNEL_ID 
) {
  throw new Error("Missing environment variables");
}

export const config: ConfigType = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_SALAI_TOKEN,
  CHAT_GPT_SECRET_KEY,
  REDIS_URL,
  MJBOT_SERVER_ID,
  MJBOT_CHANNEL_ID
};
