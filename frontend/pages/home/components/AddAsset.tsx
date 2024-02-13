import { AccountDefaultEnum, AddingAssetsEnum, TokenNetworkEnum } from "@/const";
//
import { Fragment, useEffect } from "react";
import { addToken, setAcordeonAssetIdx } from "@redux/assets/AssetReducer";

import { AccountHook } from "@pages/hooks/accountHook";
import AddAssetAutomatic from "./AddAssetAutomatic";
import AddAssetManual from "./AddAssetManual";
import { Asset } from "@redux/models/AccountModels";
import { AssetHook } from "../hooks/assetHook";
// svgs
import CloseIcon from "@assets/svg/files/close.svg?react";
import DialogAssetConfirmation from "./DialogAssetConfirmation";
import { GeneralHook } from "../hooks/generalHook";
import { Token } from "@redux/models/TokenModels";
import { TokenHook } from "../hooks/tokenHook";
import { useAppDispatch } from "@redux/Store";
import { useTranslation } from "react-i18next";

interface AddAssetsProps {
  setAssetOpen(value: boolean): void;
  assetOpen: boolean;
  asset: Asset | undefined;
  setAssetInfo(value: Asset | undefined): void;
  tokens: Token[];
  assets: Asset[];
  acordeonIdx: string[];
}

const AddAsset = ({ setAssetOpen, assetOpen, asset, setAssetInfo, tokens, assets, acordeonIdx }: AddAssetsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { authClient } = AccountHook();
  const { reloadBallance } = AssetHook();
  const { checkAssetAdded } = GeneralHook();
  const {
    newToken,
    setNewToken,
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
    manual,
    setManual,
    networkTOpen,
    setNetworkTOpen,
    assetTOpen,
    setAssetTOpen,
    network,
    setNetwork,
    newAssetList,
  } = TokenHook(asset);

  useEffect(() => {
    setErrToken("");
    setErrIndex("");
    setValidToken(false);
  }, [assetOpen]);

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-center bg-PrimaryColorLight dark:bg-PrimaryColor w-full h-full pt-8 px-6 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <div className="flex flex-row justify-between items-center w-full mb-5">
          <p className="text-lg font-bold">{asset ? t("edit.asset") : t("add.asset")}</p>
          <CloseIcon
            className="stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor cursor-pointer"
            onClick={onClose}
          />
        </div>
        {manual || asset ? (
          <AddAssetManual
            manual={manual}
            setManual={setManual}
            errToken={errToken}
            setErrToken={setErrToken}
            errIndex={errIndex}
            setErrIndex={setErrIndex}
            validToken={validToken}
            setValidToken={setValidToken}
            validIndex={validIndex}
            setValidIndex={setValidIndex}
            newToken={newToken}
            setNewToken={setNewToken}
            asset={asset}
            setAssetOpen={setAssetOpen}
            tokens={tokens}
            addAssetToData={addAssetToData}
            saveInLocalStorage={saveInLocalStorage}
          ></AddAssetManual>
        ) : (
          <AddAssetAutomatic
            setNetworkTOpen={setNetworkTOpen}
            networkTOpen={networkTOpen}
            setNetwork={setNetwork}
            network={network}
            setNewToken={setNewToken}
            newToken={newToken}
            setAssetTOpen={setAssetTOpen}
            addAssetToData={addAssetToData}
            assetTOpen={assetTOpen}
            setValidToken={setValidToken}
            setErrToken={setErrToken}
            errToken={errToken}
            setManual={setManual}
            newAssetList={newAssetList}
            assets={assets}
          ></AddAssetAutomatic>
        )}
      </div>
      {modal && (
        <DialogAssetConfirmation
          modal={modal}
          showModal={showModal}
          setAssetOpen={setAssetOpen}
          newToken={newToken}
          setNewToken={setNewToken}
          setNetwork={setNetwork}
          addStatus={addStatus}
          setManual={setManual}
        ></DialogAssetConfirmation>
      )}
    </Fragment>
  );

  function onClose() {
    addToAcordeonIdx();
    setAssetOpen(false);
    setNetwork(TokenNetworkEnum.enum["ICRC-1"]);
    setNewToken({
      address: "",
      symbol: "",
      name: "",
      tokenSymbol: "",
      tokenName: "",
      decimal: "",
      shortDecimal: "",
      fee: "0",
      subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default, amount: "0", currency_amount: "0" }],
      index: "",
      id_number: 999,
    });
    setManual(false);
    setAssetInfo(undefined);
  }

  function saveInLocalStorage(tokens: Token[]) {
    localStorage.setItem(
      authClient,
      JSON.stringify({
        from: "II",
        tokens: tokens.sort((a, b) => {
          return a.id_number - b.id_number;
        }),
      }),
    );
  }

  function addAssetToData() {
    if (checkAssetAdded(newToken.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
    } else {
      const idxSorting =
        tokens.length > 0
          ? [...tokens].sort((a, b) => {
              return b.id_number - a.id_number;
            })
          : [];
      const idx = (idxSorting.length > 0 ? idxSorting[0]?.id_number : 0) + 1;
      const tknSave = {
        ...newToken,
        id_number: idx,
        subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default, amount: "0", currency_amount: "0" }],
      };
      saveInLocalStorage([...tokens, tknSave]);
      setAddStatus(AddingAssetsEnum.enum.adding);
      showModal(true);
      dispatch(addToken(tknSave));
      reloadBallance(
        [...tokens, tknSave].sort((a, b) => {
          return a.id_number - b.id_number;
        }),
      );
      setAssetOpen(false);
    }
  }

  function addToAcordeonIdx() {
    if (!acordeonIdx.includes(asset?.tokenSymbol || "")) {
      dispatch(setAcordeonAssetIdx([...acordeonIdx, asset?.tokenSymbol || ""]));
    }
  }
};

export default AddAsset;
