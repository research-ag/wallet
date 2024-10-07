import { TokenMarketInfo } from "@redux/models/TokenModels";
import { _SERVICE as MarketActor, LatestExtendedToken } from "@candid/neutrinite/service.did";
import { idlFactory as MarketIDLFactory } from "@candid/neutrinite/candid.did";
import { Actor, Agent } from "@dfinity/agent";
import logger from "@/common/utils/logger";

const marketCanister = "u45jl-liaaa-aaaam-abppa-cai";

/**
 * Fetches token market data from the API.
 * @returns {Promise<TokenMarketInfo[]>} A promise that resolves to an array of token market data.
 */
export async function getTokensFromMarket(agent: Agent): Promise<TokenMarketInfo[]> {
  try {
    const marketActor = Actor.createActor<MarketActor>(MarketIDLFactory, {
      agent: agent,
      canisterId: import.meta.env.VITE_APP_TOKEN_MARKET || marketCanister,
    });

    const res = await marketActor.get_latest_wallet_tokens();

    return extendedTokenToMarketInfo(res.latest);
  } catch (error) {
    logger.debug("Error fetching token markets:", error);
    return [];
  }
}

const extendedTokenToMarketInfo = (extendedTokens: LatestExtendedToken[]): TokenMarketInfo[] => {
  return extendedTokens.map((token, k) => {
    let price = 0;
    for (let index = 0; index < token.rates.length; index++) {
      const rate = token.rates[index];
      if (rate.to_token === BigInt(0)) {
        price = rate.rate;
      }
    }

    return {
      id: k + 1,
      name: token.config.name,
      symbol: token.config.symbol,
      price: price,
    };
  });
};
