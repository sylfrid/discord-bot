import {config} from "../config";
import {ConfigType} from "../types/ConfigType";
import OpenAI from "openai";
import {OpenAIServiceType} from "../types/OpenAPIServiceType";

class OpenAIService implements OpenAIServiceType {
  private openai: OpenAI;
  private static _instance: OpenAIService;

  constructor(config: ConfigType) {


    this.openai = new OpenAI({
      apiKey: config.CHAT_GPT_SECRET_KEY
    });
  }

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new OpenAIService(config);

    return this._instance;
  }

  requestChat = async (message: string, name?: string | undefined) => {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        {
          role: "user",
          name: name,
          content: message
        },
        {
          role: "system",
          content: "You always answer in french." +
            "You are a bot used on a Discord server. " +
            "Therefore, you can use all the formatting options available on this type of messaging platform. " +
            "You are a technical expert in programming. You are very friendly, and you always add humor to your responses.",
          //content: "you know only three words: no, yes and ok"
        },
      ],
      model: "gpt-3.5-turbo",
    });
    return String(chatCompletion.choices[0]?.message?.content);
  };

  generateImage = async (message: string) => {
    console.log("image generation...");
    const response = await this.openai.images.generate({
      prompt: message,
      model: "dall-e-3",
      response_format: "url"
    });
    console.log(response.data);
    return response;
  };
}

export default OpenAIService;