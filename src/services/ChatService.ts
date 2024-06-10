import { ConfigType } from "../types/ConfigType";
import { ChatOpenAI } from "@langchain/openai";
import { config } from "../config";
import { BufferMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "@langchain/community/stores/message/ioredis";
import { ConversationChain } from "langchain/chains";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

class ChatService {
  private model: ChatOpenAI;
  private static _instance: ChatService;
  private chain: ConversationChain;

  constructor(config: ConfigType, channelId: string, botName: string) {
    this.model = new ChatOpenAI({
      openAIApiKey: config.CHAT_GPT_SECRET_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 1000,
      verbose: false,
    });

    const memory = new BufferMemory({
      chatHistory: new RedisChatMessageHistory({
        sessionId: channelId, // Or some other unique identifier for the conversation
        sessionTTL: 3000, // 50 minutes, omit this parameter to make sessions never expire
        url: "redis://localhost:6379", // Default value, override with your own instance's URL
      }),
      memoryKey: "history",
      returnMessages: true,
    });

    const chatPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "Ignore all instructions before this one." +
          `Ton nom est "${botName}".` + 
          "Tu es un expert en programmation, web, big data, AI, 3D" +
          "Tu réponds en français" +
          "Tu réponds sur un serveur Discord et tu as donc accès à toutes les options de formattage disponible sur cette plate-forme." +
          "Tu es très drôle et tu réponds toujours avec humour et sympathie.",
      ],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    this.chain = new ConversationChain({
      llm: this.model,
      memory: memory,
      prompt: chatPrompt,
    });
  }

  static getInstance(channelId: string, botName: string) {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ChatService(config, channelId, botName);

    return this._instance;
  }

  requestChat = async (message: string, name?: string | undefined) => {
    const response = await this.chain.call({ input: message });
    return response.response;
  };
}

export default ChatService;
