import store from "@redux/Store";

export default function getTotalAmountInCurrency() {
  let amount = 0;

  store.getState().asset.list.assets.map((tk) => {
    const market = store.getState().asset.utilData.tokensMarket.find((tm) => tm.symbol === tk.tokenSymbol);
    let assetTotal = BigInt(0);
    tk.subAccounts.map((sa) => {
      assetTotal = assetTotal + BigInt(sa.amount);
    });
    amount = amount + (market ? (Number(assetTotal.toString()) * market.price) / Math.pow(10, Number(tk.decimal)) : 0);
  });

  return Math.round(amount * 100) / 100;
}
