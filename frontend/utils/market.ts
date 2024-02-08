import { TokenMarketInfo } from "@redux/models/TokenModels";

export async function getAssetsFromMarket() {
  try {
    const response = await fetch(import.meta.env.VITE_APP_TOKEN_MARKET);
    const marketTokens = (await response.json()) as TokenMarketInfo[];
    const tokens = marketTokens.filter((x) => !x.unreleased);
    const ethRate = await fetch(import.meta.env.VITE_APP_ETH_MARKET).then((x) => x.json());

    return [
      ...tokens,
      {
        id: 999,
        name: "Ethereum",
        symbol: "ckETH",
        price: ethRate.USD,
        marketcap: 0,
        volume24: 0,
        circulating: 0,
        total: 0,
        liquidity: 0,
        unreleased: 0,
      },
    ];
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
}
