import OpenAI from "openai";
import ImagesResponse = OpenAI.ImagesResponse;

export interface OpenAIServiceType {
  requestChat: (message: string, name?: string | undefined) => Promise<string>;
  generateImage: (message: string) => Promise<ImagesResponse>;
}