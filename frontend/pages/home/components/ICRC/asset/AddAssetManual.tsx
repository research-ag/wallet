// svgs
import { ReactComponent as InfoIcon } from "@assets/svg/files/info-icon.svg";
//
import { GeneralHook } from "../../../hooks/generalHook";
import { IcrcIndexCanister, IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { getMetadataInfo, toFullDecimal } from "@/utils";
import { CustomInput } from "@components/input";
import { CustomCopy } from "@components/tooltip";
import { editToken } from "@redux/assets/AssetReducer";
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@redux/Store";
import { Token } from "@redux/models/TokenModels";
import { AccountDefaultEnum, IconTypeEnum } from "@/const";
import { Asset } from "@redux/models/AccountModels";
import { IdentityHook } from "@pages/hooks/identityHook";
import { ChangeEvent, useState } from "react";
import { Principal } from "@dfinity/principal";
import { LoadingLoader } from "@components/loader";
import { AccountHook } from "@pages/hooks/accountHook";
import { getICRCSupportedStandards } from "@pages/home/helpers/icrc";
import { db } from "@/database/db";
import { Contact } from "@redux/models/ContactsModels";

interface AddAssetManualProps {
  manual: boolean;
  setManual(value: boolean): void;
  errToken: string;
  setErrToken(value: string): void;
  errIndex: string;
  setErrIndex(value: string): void;
  validToken: boolean;
  setValidToken(value: boolean): void;
  validIndex: boolean;
  setValidIndex(value: boolean): void;
  newToken: Token;
  setNewToken(value: any): void;
  asset: Asset | undefined;
  setAssetOpen(value: boolean): void;
  tokens: Token[];
  addAssetToData(): void;
  setAssetInfo(value: Asset | undefined): void;
}

const AddAssetManual = ({
  manual,
  setManual,
  errToken,
  setErrToken,
  errIndex,
  setErrIndex,
  validToken,
  setValidToken,
  validIndex,
  setValidIndex,
  newToken,
  setNewToken,
  asset,
  setAssetOpen,
  addAssetToData,
  setAssetInfo,
}: AddAssetManualProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { authClient } = AccountHook();
  const { getAssetIcon, checkAssetAdded } = GeneralHook();
  const { userAgent } = IdentityHook();
  const [testLoading, setTestLoading] = useState(false);
  const [tested, setTested] = useState(false);
  const [errShortDec, serErrShortDec] = useState(false);

  return (
    <div className="flex flex-col items-start justify-start w-full">
      {asset ? (
        <div className="flex flex-col items-center justify-start w-full p-2">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, asset.tokenSymbol, asset.logo)}
          <p className="mt-2 text-lg font-bold">{`${asset.tokenName} - ${asset.tokenSymbol}`}</p>
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
          sufix={<CustomCopy size={"small"} copyText={newToken.address} side="left" align="center" />}
          intent={"secondary"}
          disabled={asset ? true : false}
          inputClass={asset ? "opacity-40" : ""}
          placeholder="Ledger Principal"
          compOutClass=""
          value={newToken.address}
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
          sufix={<CustomCopy size={"small"} copyText={newToken.index || ""} side="left" align="center" />}
          placeholder="Index Principal"
          compOutClass=""
          value={newToken.index}
          onChange={onChangeIndex}
          border={errToken ? "error" : undefined}
        />
        {errIndex !== "" && errIndex !== "non" && <p className="text-sm text-left text-LockColor">{errIndex}</p>}
        {validIndex && <p className="text-sm text-left text-slate-color-info">{t("index.validation.msg")}</p>}
      </div>
      {!asset && (
        <div className="flex justify-end w-full">
          <CustomButton
            intent={newToken.address.length > 5 ? "success" : "deny"}
            onClick={() => onTest(true)}
            disabled={newToken.address.length <= 5}
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
          value={newToken.symbol}
          onChange={onChangeSymbol}
          disabled={!asset && !tested}
        />
      </div>
      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60">{t("token.name")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          placeholder="-"
          compOutClass=""
          value={newToken.name}
          onChange={onChangeName}
          disabled={!asset && !tested}
        />
      </div>
      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60 ">{t("fee")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          placeholder="0"
          compOutClass="opacity-60"
          value={toFullDecimal(newToken.fee || "0", Number(newToken.decimal || "0"))}
          disabled
        />
      </div>
      <div className={`flex flex-row justify-start items-center ${asset ? "w-[85%]" : "w-full"} gap-2`}>
        <div className="flex flex-col items-start w-full mb-3">
          <p className="opacity-60">{t("token.decimal")}</p>
          <CustomInput
            sizeInput={"medium"}
            inputClass={asset ? "opacity-40" : ""}
            intent={"secondary"}
            placeholder=""
            disabled={true}
            compOutClass=""
            type="number"
            value={newToken.decimal}
            onChange={onChangeDecimal}
          />
        </div>
        {asset && (
          <div className="flex flex-col items-start w-full mb-3">
            <p className="opacity-60 text-md">{t("short.form.limit")}</p>
            <CustomInput
              sizeInput={"medium"}
              intent={"secondary"}
              placeholder=""
              compOutClass=""
              type="number"
              value={newToken.shortDecimal}
              onChange={onChangeShortDecimal}
              border={errShortDec ? "error" : undefined}
            />
          </div>
        )}
      </div>

      <div className="flex flex-row justify-between w-full gap-4">
        {manual && (
          <CustomButton intent="deny" className="mr-3 min-w-[5rem]" onClick={onBack}>
            <p>{t("back")}</p>
          </CustomButton>
        )}
        <CustomButton
          intent={(asset ? newToken.address.length > 5 : tested) ? "accept" : "deny"}
          onClick={onSave}
          disabled={asset ? newToken.address.length <= 5 : !tested}
        >
          {t("save")}
        </CustomButton>
      </div>
    </div>
  );

  function onLedgerChange(e: ChangeEvent<HTMLInputElement>) {
    setNewToken((prev: any) => {
      return { ...prev, address: e.target.value.trim() };
    });
    setValidToken(false);
    if (e.target.value.trim() !== "")
      try {
        Principal.fromText(e.target.value.trim());
        setErrToken("");
      } catch {
        setErrToken("non");
      }
    else setErrToken("");
  }

  function onChangeIndex(e: ChangeEvent<HTMLInputElement>) {
    setNewToken((prev: any) => {
      return { ...prev, index: e.target.value };
    });
    setValidIndex(false);
    if (e.target.value.trim() !== "")
      try {
        Principal.fromText(e.target.value.trim());
        setErrIndex("");
      } catch {
        setErrIndex("non");
      }
    else setErrIndex("");
  }

  function onChangeSymbol(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= 8)
      setNewToken((prev: any) => {
        return { ...prev, symbol: e.target.value };
      });
  }

  function onChangeName(e: ChangeEvent<HTMLInputElement>) {
    setNewToken((prev: any) => {
      return { ...prev, name: e.target.value };
    });
  }

  function onChangeDecimal(e: ChangeEvent<HTMLInputElement>) {
    setNewToken((prev: any) => {
      return { ...prev, decimal: e.target.value };
    });
  }

  function onChangeShortDecimal(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value === "" ? "" : Number(e.target.value) === 0 ? "0" : e.target.value;
    if (Number(value) <= Number(newToken.decimal))
      setNewToken((prev: any) => {
        return { ...prev, shortDecimal: value };
      });
    serErrShortDec(false);
  }

  function onBack() {
    setManual(false);
    setNewToken({
      address: "",
      symbol: "",
      name: "",
      decimal: "",
      shortDecimal: "",
      tokenSymbol: "",
      tokenName: "",
      fee: "",
      subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default, amount: "0", currency_amount: "0" }],
      index: "",
      id_number: 999,
    });
    setErrToken("");
    setErrIndex("");
    setValidToken(false);
    setValidIndex(false);
  }

  async function onTest(override: boolean): Promise<boolean> {
    setTestLoading(true);
    let validData = false;
    if (checkAssetAdded(newToken.address)) {
      setErrToken(t("adding.asset.already.imported"));
      setValidToken(false);
      validData = false;
    } else {
      try {
        const { metadata } = IcrcLedgerCanister.create({
          agent: userAgent,
          canisterId: newToken.address as any,
        });

        const myMetadata = await metadata({
          certified: false,
        });

        const { symbol, decimals, name, logo, fee } = getMetadataInfo(myMetadata);
        const supportedStandards = await getICRCSupportedStandards({
          assetAddress: newToken.address,
          agent: userAgent,
        });

        setNewToken((prev: any) => {
          return {
            ...prev,
            decimal: decimals.toFixed(0),
            shortDecimal: decimals.toFixed(0),
            symbol: override ? symbol : prev.symbol,
            name: override ? name : prev.name,
            logo: logo,
            tokenSymbol: symbol,
            tokenName: name,
            fee: fee,
            supportedStandards,
          };
        });
        setValidToken(true);
        validData = true;
      } catch (e) {
        setErrToken(t("add.asset.import.error"));
        setValidToken(false);
        validData = false;
      }
    }
    if (newToken.index && newToken.index !== "" && newToken.shortDecimal !== "")
      try {
        const { getTransactions } = IcrcIndexCanister.create({
          canisterId: newToken.index as any,
        });
        await getTransactions({ max_results: BigInt(1), account: { owner: Principal.fromText(authClient) } });
        setValidIndex(true);
      } catch {
        validData = false;
        setErrIndex(t("add.index.import.error"));
        setValidIndex(false);
      }
    else setValidIndex(false);

    setTestLoading(false);
    setTested(validData);
    return validData;
  }

  async function onSave() {
    if (asset) {
      if (newToken.shortDecimal === "") {
        serErrShortDec(true);
        return;
      }
      // Change contacts local and reducer
      setTimeout(async () => {
        const affectedContacts: Contact[] = [];
        const currentContacts = await db().getContacts();

        for (const cnt of currentContacts) {
          let affected = false;
          const newDoc = {
            ...cnt,
            assets: cnt.assets.map((asst) => {
              if (asst.tokenSymbol === asset.tokenSymbol) {
                affected = true;
                return { ...asst, symbol: asset.symbol };
              } else return asst;
            }),
          };
          if (affected) {
            affectedContacts.push(newDoc);
          }
        }

        await Promise.all(affectedContacts.map((c) => db().updateContact(c.principal, c)));
      }, 0);

      // List all tokens modifying the one we selected
      const token = await db().getToken(newToken.address);
      if (token) {
        await db().updateToken(token.address, {
          ...newToken,
          decimal: Number(newToken.decimal).toFixed(0),
          shortDecimal:
            newToken.shortDecimal === ""
              ? Number(newToken.decimal).toFixed(0)
              : Number(newToken.shortDecimal).toFixed(0),
        });
      }
      // Edit tokens list and assets list
      dispatch(editToken(newToken, asset.tokenSymbol));
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
        supportedStandards: [],
      });
      setAssetInfo(undefined);
      setAssetOpen(false);
    } else if (await onTest(false)) addAssetToData();
  }
};

export default AddAssetManual;
