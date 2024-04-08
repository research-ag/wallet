import { AddingAssets, AddingAssetsEnum, TokenNetwork, TokenNetworkEnum, AccountDefaultEnum } from "@/const";
import { ICRC1systemAssets } from "@/defaultTokens";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { useEffect, useState } from "react";

export const TokenHook = (asset: Asset | undefined) => {
  const { assetLoading, icr1SystemAssets } = useAppSelector((state) => state.asset);
  const [manual, setManual] = useState(false);
  const [network, setNetwork] = useState<TokenNetwork>(TokenNetworkEnum.enum["ICRC-1"]);
  const [newAssetList, setNewAssetList] = useState<Array<Asset>>(ICRC1systemAssets);
  const [networkTOpen, setNetworkTOpen] = useState(false);
  const [assetTOpen, setAssetTOpen] = useState(false);
  const [errToken, setErrToken] = useState("");
  const [errIndex, setErrIndex] = useState("");
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
  const [validToken, setValidToken] = useState(false);
  const [validIndex, setValidIndex] = useState(false);
  const [addAssetOpen, setAddAssetOpen] = useState<boolean>(false);
  const [modal, showModal] = useState(false);
  const [addStatus, setAddStatus] = useState<AddingAssets>(AddingAssetsEnum.Enum.none);

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
    if (!assetLoading) setAddStatus(AddingAssetsEnum.Enum.done);
  }, [assetLoading]);

  useEffect(() => setNewAssetList(icr1SystemAssets), [icr1SystemAssets]);

  return {
    manual,
    setManual,
    addAssetOpen,
    setAddAssetOpen,
    validToken,
    setValidToken,
    validIndex,
    setValidIndex,
    errToken,
    setErrToken,
    errIndex,
    setErrIndex,
    modal,
    showModal,
    addStatus,
    setAddStatus,
    networkTOpen,
    setNetworkTOpen,
    assetTOpen,
    setAssetTOpen,
    network,
    setNetwork,
    newAssetList,
    newAsset,
    setNewAsset,
  };
};
