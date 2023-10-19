// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "../hooks/generalHook";
import { AccountDefaultEnum, AddingAssetsEnum, TokenNetworkEnum } from "@/const";
import { TokenHook } from "../hooks/tokenHook";
import { Asset } from "@redux/models/AccountModels";
import { Token } from "@redux/models/TokenModels";
import { AssetHook } from "../hooks/assetHook";
import { useAppDispatch } from "@redux/Store";
import DialogAssetConfirmation from "./DialogAssetConfirmation";
import AddAssetManual from "./AddAssetManual";
import { addToken } from "@redux/assets/AssetReducer";
import AddAssetAutomatic from "./AddAssetAutomatic";
import { db } from "@/database/db";

interface AddAssetsProps {
  setAssetOpen(value: boolean): void;
  assetOpen: boolean;
  asset: Asset | undefined;
  setAssetInfo(value: Asset | undefined): void;
  tokens: Token[];
}

const AddAsset = ({ setAssetOpen, assetOpen, asset, setAssetInfo, tokens }: AddAssetsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { reloadBallance } = AssetHook();
  const { checkAssetAdded } = GeneralHook();
  const {
    newToken,
    setNewToken,
    validToken,
    setValidToken,
    errToken,
    setErrToken,
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
            validToken={validToken}
            setValidToken={setValidToken}
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
    setAssetOpen(false);
    setNetwork(TokenNetworkEnum.enum["ICRC-1"]);
    setNewToken({
      address: "",
      symbol: "",
      name: "",
      decimal: "",
      subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default }],
      index: "",
      id_number: 999,
    });
    setManual(false);
    setAssetInfo(undefined);
  }

  async function saveInLocalStorage(tokens: Token[]) {
    await db().setTokens(tokens);
  }

  async function addAssetToData() {
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
        subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default }],
      };
      await saveInLocalStorage([...tokens, tknSave]);
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
};

export default AddAsset;
