import { CommandType } from "../types/CommandType";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { config } from "../config";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

class InfoCommand implements CommandType {
  commandName = "info";
  chain: RetrievalQAChain | undefined;

  constructor() {
    this.initEmbedding();
  }

  initEmbedding = async () => {
    const model = new ChatOpenAI({
      openAIApiKey: config.CHAT_GPT_SECRET_KEY,
    });

    //const loader = new TextLoader(`${process.env.PWD}/data/database.txt`);
    const loader = new DirectoryLoader(`${process.env.PWD}/data/`, {
      ".pdf": (path) => new PDFLoader(path),
      ".txt": (path) => new TextLoader(path),
    });
    const docs = await loader.load();
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        openAIApiKey: config.CHAT_GPT_SECRET_KEY,
      })
    );
    this.chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    console.log("DOCUMENTS LOADED");
  };

  execute = async (interaction: CommandInteraction) => {
    console.log("execute command : /" + this.commandName);
    let response: string;
    if (this.chain === undefined) {
      console.log("LangChain not set yet...");
      return;
    }
    try {
      const chainResponse = await this.chain.invoke({
        query: String(interaction.options.get("question")?.value),
      });
      response = chainResponse.text;
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
      .setDescription("Replies with internal informations")
      .addStringOption((option) =>
        option
          .setName("question")
          .setDescription("The input to echo back")
          .setRequired(true)
      );
  };
}

export default InfoCommand;
