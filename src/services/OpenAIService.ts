import { config } from "../config";
import { ConfigType } from "../types/ConfigType";
import OpenAI from "openai";

class OpenAIService {
  private openai: OpenAI;
  private static _instance: OpenAIService;

  constructor(config: ConfigType) {
    this.openai = new OpenAI({
      apiKey: config.CHAT_GPT_SECRET_KEY,
    });
  }

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new OpenAIService(config);

    return this._instance;
  }

  generateImage = async (message: string) => {
    console.log("image generation...");
    const response = await this.openai.images.generate({
      prompt: message,
      model: "dall-e-3",
      response_format: "url",
    });
    console.log(response.data);

    return response;
  };
}

export default OpenAIService;
