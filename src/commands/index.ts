import ChatCommand from "./ChatCommand";
import {CommandType} from "../types/CommandType";
import ImageCommand from "./ImageCommand";

export const commands: CommandType[] = [
  new ImageCommand(),
  new ChatCommand()
];
