import { config } from "../config";
import { Midjourney, MJConfigParam } from "midjourney";
import { ConfigType } from "../types/ConfigType";

class MidJourneyService {
  public midJourney: Midjourney;
  private static _instance: MidJourneyService;

  constructor(config: ConfigType) {
    this.midJourney = new Midjourney({
      ServerId: config.MJBOT_SERVER_ID,
      ChannelId: config.MJBOT_CHANNEL_ID,
      SalaiToken: config.DISCORD_SALAI_TOKEN,
      Debug: false,
      Ws: true,
    });
  }

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new MidJourneyService(config);

    return this._instance;
  }
}

export default MidJourneyService;
