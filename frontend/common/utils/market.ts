import { TokenMarketInfo } from "@redux/models/TokenModels";
import logger from "@/common/utils/logger";

/**
 * Fetches token market data from the API.
 * @returns {Promise<TokenMarketInfo[]>} A promise that resolves to an array of token market data.
 */
export async function getTokensFromMarket(): Promise<TokenMarketInfo[]> {
  const marketUrl = import.meta.env.VITE_APP_TOKEN_MARKET;

  try {
    const response = await fetch(marketUrl);
    const tokenMarkets: TokenMarketInfo[] = await response.json();
    return tokenMarkets.filter((token) => !token.unreleased);
  } catch (error) {
    logger.debug("Error fetching token markets:", error);
    return [];
  }
}

/**
 * Fetches the current Ethereum rate from the API.
 * @returns {Promise<TokenMarketInfo | undefined>} A promise that resolves to the Ethereum rate or undefined if an error occurred.
 */
export async function getETHRate() {
  try {
    const ethUrl = import.meta.env.VITE_APP_ETH_MARKET;
    const ethRate = await fetch(ethUrl).then((x) => x.json());

    return {
      id: 998,
      name: "ckETH",
      symbol: "ckETH",
      price: ethRate.USD,
      marketcap: 0,
      volume24: 0,
      circulating: 0,
      total: 0,
      liquidity: 0,
      unreleased: 0,
    };
  } catch (error) {
    logger.debug("Error fetching ETH rate:", error);
    return undefined;
  }
}

export async function getckUSDCRate() {
  return {
    id: 999,
    name: "ckUSDC",
    symbol: "ckUSDC",
    price: 1,
    marketcap: 0,
    volume24: 0,
    circulating: 0,
    total: 0,
    liquidity: 0,
    unreleased: 0,
  };
}
