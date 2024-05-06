import { AccountDefaultEnum, TokenNetwork, TokenNetworkEnum } from "@/const";
import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";

export const TokenHook = () => {
  const { assetMutated } = useAppSelector((state) => state.asset.mutation);
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const [errIndex, setErrIndex] = useState("");
  const [network, setNetwork] = useState<TokenNetwork>(TokenNetworkEnum.enum["ICRC-1"]);
  const [errToken, setErrToken] = useState("");
  const [validToken, setValidToken] = useState(false);

  const [newAsset, setNewAsset] = useState<Asset>({
    address: "",
    symbol: "",
    name: "",
    tokenSymbol: "",
    tokenName: "",
    decimal: "",
    shortDecimal: "",
    subAccounts: [
      {
        sub_account_id: "0x0",
        name: AccountDefaultEnum.Values.Default,
        amount: "0",
        currency_amount: "0",
        address: "",
        decimal: 0,
        symbol: "",
        transaction_fee: "0",
      },
    ],
    index: "",
    sortIndex: 999,
    supportedStandards: [],
  });

  useEffect(() => {
    if (assetMutated) {
      setNewAsset({
        address: assetMutated.address,
        symbol: assetMutated.symbol,
        name: assetMutated.name,
        tokenName: assetMutated.tokenName,
        tokenSymbol: assetMutated.tokenSymbol,
        decimal: assetMutated.decimal,
        shortDecimal: assetMutated.shortDecimal,
        subAccounts: assetMutated.subAccounts.map((ast) => {
          return {
            name: ast.name,
            sub_account_id: ast.sub_account_id,
            amount: ast.amount,
            currency_amount: ast.currency_amount,
            address: ast.address,
            decimal: ast.decimal,
            symbol: ast.symbol,
            transaction_fee: ast.transaction_fee,
          };
        }),
        index: assetMutated.index,
        sortIndex: assetMutated.sortIndex,
        supportedStandards: assetMutated.supportedStandards,
      });
      setErrToken("");
      setValidToken(false);
    }
  }, [assetMutated]);

  useEffect(() => {
    // TODO: set to redux status adding asset
    // if (!isAppDataFreshing) setAddStatus(AddingAssetsEnum.Enum.done);
  }, [isAppDataFreshing]);

  return {
    newAsset,
    setNewAsset,
    errIndex,
    setErrIndex,
    validToken,
    setValidToken,
    network,
    setNetwork,
    setErrToken,
    errToken,
  };
};
