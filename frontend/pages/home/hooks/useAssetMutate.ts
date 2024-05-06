import { defaultSubAccount } from "@/defaultTokens";
import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";

export const assetMutateInitialState: Asset = {
  address: "",
  symbol: "",
  name: "",
  tokenSymbol: "",
  tokenName: "",
  decimal: "",
  shortDecimal: "",
  subAccounts: [defaultSubAccount],
  index: "",
  sortIndex: 999,
  supportedStandards: [],
};

export default function useAssetMutate() {
  const { assetMutated } = useAppSelector((state) => state.asset.mutation);
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const [errIndex, setErrIndex] = useState("");
  const [errToken, setErrToken] = useState("");
  const [validToken, setValidToken] = useState(false);

  const [newAsset, setNewAsset] = useState<Asset>(assetMutateInitialState);

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
    setErrToken,
    errToken,
  };
}
