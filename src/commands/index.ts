import {CommandType} from "../types/CommandType";
import ImageCommand from "./ImageCommand";
import InfoCommand from "./InfoCommand";
//import MidJourneyCommand from './MidJourneyCommand';

export const commands: CommandType[] = [
  new ImageCommand(),
  new InfoCommand(),
  //new MidJourneyCommand(),
];
