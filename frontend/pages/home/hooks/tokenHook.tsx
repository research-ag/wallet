import { TokenNetwork, TokenNetworkEnum, AccountDefaultEnum } from "@/const";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { useEffect, useState } from "react";

export const TokenHook = () => {
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const { asset } = useAppSelector((state) => state.asset.mutation);
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
    if (asset) {
      setNewAsset({
        address: asset.address,
        symbol: asset.symbol,
        name: asset.name,
        tokenName: asset.tokenName,
        tokenSymbol: asset.tokenSymbol,
        decimal: asset.decimal,
        shortDecimal: asset.shortDecimal,
        subAccounts: asset.subAccounts.map((ast) => {
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
        index: asset.index,
        sortIndex: asset.sortIndex,
        supportedStandards: asset.supportedStandards,
      });
      setErrToken("");
      setValidToken(false);
    }
  }, [asset]);

  useEffect(() => {
    // TODO: set to redux status adding asset
    // if (!isAppDataFreshing) setAddStatus(AddingAssetsEnum.Enum.done);
  }, [isAppDataFreshing]);

  return {
    errIndex,
    setErrIndex,
    newAsset,
    setNewAsset,
    validToken,
    setValidToken,
    network,
    setNetwork,
    setErrToken,
    errToken,
  };
};
