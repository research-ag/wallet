// svgs
import { ReactComponent as InfoIcon } from "@assets/svg/files/info-icon.svg";
//
import { IcrcIndexCanister } from "@dfinity/ledger-icrc";
import { CustomInput } from "@components/input";
import { CustomCopy } from "@components/tooltip";
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
import { IconTypeEnum } from "@/common/const";
import { Asset } from "@redux/models/AccountModels";
import { ChangeEvent, useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import { LoadingLoader } from "@components/loader";
import { AccountHook } from "@pages/hooks/accountHook";
import { db } from "@/database/db";
import { getAssetIcon } from "@/common/utils/icons";
import {
  AssetMutationAction,
  AssetMutationResult,
  setAccordionAssetIdx,
  setAssetMutation,
  setAssetMutationAction,
  setAssetMutationResult,
  setSelectedAsset,
} from "@redux/assets/AssetReducer";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import useAssetMutate, { assetMutateInitialState } from "@pages/home/hooks/useAssetMutate";
import { toFullDecimal } from "@common/utils/amount";
import getAssetDetails from "@pages/home/helpers/getAssetDetails";
import logger from "@/common/utils/logger";
import { Contact } from "@redux/models/ContactsModels";

const AddAssetManual = () => {
  const { assetAction, assetMutated } = useAppSelector((state) => state.asset.mutation);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { newAsset, setNewAsset, setErrToken, errToken } = useAssetMutate();

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { authClient } = AccountHook();
  const [errShortDec, serErrShortDec] = useState(false);

  const [tested, setTested] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  // 
  const [validIndex, setValidIndex] = useState(false);
  const [validToken, setValidToken] = useState(false);
  //
  const [errIndex, setErrIndex] = useState("");
  const isUpdate = assetAction === AssetMutationAction.UPDATE;

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
    }
  }, [assetMutated]);

  return (
    <div className="flex flex-col items-start justify-start w-full">
      {isUpdate ? (
        <div className="flex flex-col items-center justify-start w-full p-2">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, newAsset.tokenSymbol, newAsset.logo)}
          <p className="mt-2 text-lg font-bold">{`${newAsset.name} - ${newAsset.symbol}`}</p>
        </div>
      ) : (
        <div className="flex flex-row items-start justify-start w-full p-2 border rounded-lg border-SelectRowColor bg-SelectRowColor/10">
          <InfoIcon className="w-5 h-5 mt-1 mr-2 fill-SelectRowColor" />
          <p className="w-full text-justify opacity-60">
            {t("asset.add.warning.1")} <span className=" text-SelectRowColor">{t("asset.add.warning.2")}</span>
          </p>
        </div>
      )}

      <div className="flex flex-col items-start w-full mt-3 mb-3">
        <p className="opacity-60">{t("token.contract.address")}</p>
        <CustomInput
          sizeInput={"medium"}
          sufix={<CustomCopy size={"small"} copyText={newAsset.address} side="left" align="center" />}
          intent={"secondary"}
          disabled={isUpdate ? true : false}
          inputClass={isUpdate ? "opacity-40" : ""}
          placeholder="Ledger Principal"
          compOutClass=""
          value={newAsset.address}
          onChange={onLedgerChange}
          border={errToken ? "error" : undefined}
        />
        {errToken !== "" && errToken !== "non" && <p className="text-sm text-left text-LockColor">{errToken}</p>}
        {validToken && <p className="text-sm text-left text-slate-color-info">{t("token.validation.msg")}</p>}
      </div>

      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60">{t("token.index.address")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          sufix={<CustomCopy size={"small"} copyText={newAsset.index || ""} side="left" align="center" />}
          placeholder="Index Principal"
          compOutClass=""
          value={newAsset.index}
          onChange={onChangeIndex}
          border={errIndex ? "error" : undefined}
        />
        {errIndex !== "" && errIndex !== "non" && <p className="text-sm text-left text-LockColor">{errIndex}</p>}
        {validIndex && <p className="text-sm text-left text-slate-color-info">{t("index.validation.msg")}</p>}
      </div>

      {!isUpdate && (
        <div className="flex justify-end w-full">
          <CustomButton
            intent={newAsset.address.length > 5 ? "success" : "deny"}
            onClick={() => onTest(true)}
            disabled={newAsset.address.length <= 5}
          >
            {testLoading ? <LoadingLoader className="mt-1" /> : t("test")}
          </CustomButton>
        </div>
      )}

      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60">{t("token.symbol")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          placeholder="-"
          compOutClass=""
          value={newAsset.symbol}
          onChange={onChangeSymbol}
          disabled={!isUpdate && !tested}
        />
      </div>

      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60">{t("token.name")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          placeholder="-"
          compOutClass=""
          value={newAsset.name}
          onChange={onChangeName}
          disabled={!isUpdate && !tested}
        />
      </div>

      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60 ">{t("fee")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          placeholder="0"
          compOutClass="opacity-60"
          value={toFullDecimal(newAsset.subAccounts[0].transaction_fee || "0", Number(newAsset.decimal || "0"))}
          disabled
        />
      </div>

      <div className={`flex flex-row justify-start items-center ${isUpdate ? "w-[85%]" : "w-full"} gap-2`}>
        <div className="flex flex-col items-start w-full mb-3">
          <p className="opacity-60">{t("token.decimal")}</p>
          <CustomInput
            sizeInput={"medium"}
            inputClass={isUpdate ? "opacity-40" : ""}
            intent={"secondary"}
            placeholder=""
            disabled={true}
            compOutClass=""
            type="number"
            value={newAsset.decimal}
            onChange={onChangeDecimal}
          />
        </div>
        {isUpdate && (
          <div className="flex flex-col items-start w-full mb-3">
            <p className="opacity-60 text-md">{t("short.form.limit")}</p>
            <CustomInput
              sizeInput={"medium"}
              intent={"secondary"}
              placeholder=""
              compOutClass=""
              value={newAsset.shortDecimal}
              onChange={onChangeShortDecimal}
              border={errShortDec ? "error" : undefined}
            />
          </div>
        )}
      </div>

      <div className="flex flex-row justify-between w-full gap-4">
        {assetAction !== AssetMutationAction.UPDATE && (
          <CustomButton intent="deny" className="mr-3 min-w-[5rem]" onClick={onBack}>
            <p>{t("back")}</p>
          </CustomButton>
        )}
        <CustomButton
          intent={(isUpdate ? newAsset.address.length > 5 : tested) ? "accept" : "deny"}
          onClick={onSave}
          disabled={isUpdate ? newAsset.address.length <= 5 : !tested}
        >
          {t("save")}
        </CustomButton>
      </div>
    </div>
  );

  function checkAssetAdded(address: string) {
    return assets.find((asst: Asset) => asst.address === address) ? true : false;
  }

  function onLedgerChange(e: ChangeEvent<HTMLInputElement>) {
    setNewAsset((prev: Asset) => {
      return { ...prev, address: e.target.value.trim() };
    });

    setValidToken(false);
    if (e.target.value.trim() !== "")
      try {
        Principal.fromText(e.target.value.trim());
        setErrToken("");
      } catch (error) {
        logger.debug("Error getting ledger", error);
        setErrToken("non");
      }
    else setErrToken("");
  }

  function onChangeIndex(e: ChangeEvent<HTMLInputElement>) {

    setNewAsset((prev: Asset) => {
      return { ...prev, index: e.target.value };
    });

    setValidIndex(false);
    if (e.target.value.trim() !== "")
      try {
        Principal.fromText(e.target.value.trim());
        setErrIndex("");
      } catch (error) {
        logger.debug("Error getting index", error);
        setErrIndex("non");
      }
    else setErrIndex("");
  }

  function onChangeSymbol(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= 12)
      setNewAsset((prev: Asset) => {
        return { ...prev, symbol: e.target.value };
      });
  }

  function onChangeName(e: ChangeEvent<HTMLInputElement>) {
    setNewAsset((prev: Asset) => {
      return { ...prev, name: e.target.value.slice(0, 30) };
    });
  }

  function onChangeDecimal(e: ChangeEvent<HTMLInputElement>) {
    setNewAsset((prev: Asset) => {
      return { ...prev, decimal: e.target.value };
    });
  }

  function onChangeShortDecimal(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value === "" ? "" : Number(e.target.value) === 0 ? "0" : e.target.value;
    if (
      (Number(value) <= Number(newAsset.decimal) && RegExp("^[0-9]").test(value) && !value.includes(".")) ||
      value === ""
    )
      setNewAsset((prev: Asset) => {
        return { ...prev, shortDecimal: value };
      });
    serErrShortDec(false);
  }

  function onBack() {
    dispatch(setAssetMutationAction(AssetMutationAction.ADD_AUTOMATIC));
    setNewAsset(assetMutateInitialState);
    setErrToken("");
    setErrIndex("");
    setValidToken(false);
    setValidIndex(false);
  }

  async function onTest(override: boolean): Promise<boolean> {
    setTestLoading(true);
    let validData = false;

    if (checkAssetAdded(newAsset.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
      validData = false;
    } else {
      try {
        const newAssetUpdated = await getAssetDetails({
          canisterId: newAsset.address,
          includeDefault: true,
          customName: override ? undefined : newAsset.name,
          customSymbol: override ? undefined : newAsset.symbol,
          ledgerIndex: newAsset.index,
          sortIndex: newAsset.sortIndex,
        });

        if (newAssetUpdated)
          setNewAsset((prev: Asset) => {
            const newAsset: Asset = {
              ...prev,
              ...newAssetUpdated,
            };
            return newAsset;
          });
        else setErrToken(t("add.asset.import.error"));

        setValidToken(!!newAssetUpdated);
        validData = !!newAssetUpdated;
      } catch (e) {
        setErrToken(t("add.asset.import.error"));
        setValidToken(false);
        validData = false;
      }
    }
    const isIndexValid = (await isAssetIndexValid(newAsset.index)) || newAsset.index === "";

    if (!isIndexValid) validData = false;
    setValidIndex(newAsset.index !== "" && isIndexValid);

    setTestLoading(false);
    setTested(validData);
    return validData;
  }

  async function isAssetIndexValid(indexAddress: string | undefined) {
    try {
      if (!indexAddress) return false;
      const canisterId = Principal.fromText(indexAddress);
      const { getTransactions } = IcrcIndexCanister.create({ canisterId });
      await getTransactions({ max_results: BigInt(1), account: { owner: Principal.fromText(authClient) } });
      return true;
    } catch (error) {
      logger.debug("Error getting index", error);
      return false;
    }
  }

  async function onSave() {
    if (errIndex !== "" || errToken !== "") return;

    if (isUpdate) {
      // INFO: saving an updated asset
      if (newAsset.shortDecimal === "") {
        serErrShortDec(true);
        return;
      }

      setTimeout(async () => {
        const affectedContacts: Contact[] = [];
        const currentContacts = await db().getContacts();

        for (const contact of currentContacts) {
          let affected = false;

          const newDoc = {
            ...contact,
            accounts: contact.accounts.map((currentAccount) => {
              if (currentAccount.tokenSymbol === newAsset?.tokenSymbol) {
                affected = true;
                return { ...currentAccount, symbol: newAsset.symbol };
              } else return currentAccount;
            }),
          };

          if (affected) {
            affectedContacts.push(newDoc);
          }
        }

        await Promise.all(
          affectedContacts.map((contact) => db().updateContact(contact.principal, contact, { sync: true })),
        );

        const assetDB = await db().getAsset(newAsset.address);

        if (assetDB) {
          // INFO: update an asset
          const updatedFull: Asset = {
            ...newAsset,
            decimal: Number(newAsset.decimal).toFixed(0),
            shortDecimal:
              newAsset.shortDecimal === ""
                ? Number(newAsset.decimal).toFixed(0)
                : Number(newAsset.shortDecimal).toFixed(0),
          };
          await db().updateAsset(assetDB.address, updatedFull, { sync: true });
        }

        dispatch(setSelectedAsset(newAsset));
        dispatch(setAccordionAssetIdx([newAsset.tokenSymbol]));
        setNewAsset(assetMutateInitialState);
        dispatch(setAssetMutation(undefined));
        dispatch(setAssetMutationAction(AssetMutationAction.NONE));
      }, 0);
    } else if (await onTest(false)) addAssetToData();
  }

  async function addAssetToData() {
    if (isAssetAdded(newAsset.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
      return;
    }

    try {
      dispatch(setAssetMutation(newAsset));
      dispatch(setAssetMutationResult(AssetMutationResult.ADDING));

      const idxSorting = assets.length > 0 ? [...assets].sort((a, b) => b.sortIndex - a.sortIndex) : [];
      const sortIndex = (idxSorting.length > 0 ? idxSorting[0]?.sortIndex : 0) + 1;

      const updatedAsset = await getAssetDetails({
        canisterId: newAsset.address,
        includeDefault: true,
        customName: newAsset.name,
        customSymbol: newAsset.symbol,
        supportedStandard: newAsset.supportedStandards,
        sortIndex,
        ledgerIndex: newAsset.index,
      });

      const assetToSave: Asset = { ...newAsset, ...updatedAsset, sortIndex };
      await db().addAsset(assetToSave, { sync: true });

      dispatch(setAssetMutationResult(AssetMutationResult.ADDED));
      dispatch(setSelectedAsset(newAsset));
      dispatch(setAccordionAssetIdx([newAsset.tokenSymbol]));
    } catch (error) {
      logger.debug("Error adding asset", error);
      dispatch(setAssetMutationResult(AssetMutationResult.FAILED));
    } finally {
      dispatch(setAssetMutationAction(AssetMutationAction.NONE));
    }
  }

  function isAssetAdded(address: string) {
    return assets.find((asst: Asset) => asst.address === address) ? true : false;
  }
};

export default AddAssetManual;
