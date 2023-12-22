// svgs
import { ReactComponent as InfoIcon } from "@assets/svg/files/info-icon.svg";
//
import { GeneralHook } from "../hooks/generalHook";
import { IcrcIndexCanister, IcrcLedgerCanister } from "@dfinity/ledger";
import { getMetadataInfo } from "@/utils";
import { CustomInput } from "@components/Input";
import { CustomCopy } from "@components/CopyTooltip";
import { editAssetName } from "@redux/contacts/ContactsReducer";
import { editToken } from "@redux/assets/AssetReducer";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@redux/Store";
import { Token } from "@redux/models/TokenModels";
import { AccountDefaultEnum, IconTypeEnum } from "@/const";
import { Asset } from "@redux/models/AccountModels";
import { IdentityHook } from "@pages/hooks/identityHook";
import { ChangeEvent, useState } from "react";
import { Principal } from "@dfinity/principal";
import LoadingLoader from "@components/Loader";
import { AccountHook } from "@pages/hooks/accountHook";

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
  saveInLocalStorage(value: Token[]): void;
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
  tokens,
  addAssetToData,
  saveInLocalStorage,
}: AddAssetManualProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { authClient } = AccountHook();
  const { getAssetIcon, checkAssetAdded } = GeneralHook();
  const { userAgent } = IdentityHook();
  const [testLoading, setTestLoading] = useState(false);
  const [errShortDec, serErrShortDec] = useState(false);

  return (
    <div className="flex flex-col justify-start items-start w-full">
      {asset ? (
        <div className="flex flex-col justify-start items-center w-full p-2">
          {getAssetIcon(IconTypeEnum.Enum.ASSET, asset.tokenSymbol, asset.logo)}
          <p className="text-lg font-bold mt-2">{`${asset.tokenName} - ${asset.tokenSymbol}`}</p>
        </div>
      ) : (
        <div className="flex flex-row justify-start items-start w-full p-2 rounded-lg border border-SelectRowColor bg-SelectRowColor/10">
          <InfoIcon className="h-5 w-5 fill-SelectRowColor mr-2 mt-1" />
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
        {errToken !== "" && errToken !== "non" && <p className="text-LockColor text-left text-sm">{errToken}</p>}
        {validToken && <p className="text-BorderSuccessColor text-left text-sm">{t("token.validation.msg")}</p>}
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
        {errIndex !== "" && errIndex !== "non" && <p className="text-LockColor text-left text-sm">{errIndex}</p>}
        {validIndex && <p className="text-BorderSuccessColor text-left text-sm">{t("index.validation.msg")}</p>}
      </div>
      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60">{t("token.symbol")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          placeholder="-"
          compOutClass=""
          value={newToken.symbol}
          onChange={onChangeSymbol}
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
        />
      </div>
      <div className={`flex flex-row justify-start items-center ${asset ? "w-[85%]" : "w-full"} gap-2`}>
        <div className="flex flex-col items-start w-full mb-3">
          <p className="opacity-60">{t("token.decimal")}</p>
          <CustomInput
            sizeInput={"medium"}
            inputClass={asset ? "opacity-40" : ""}
            intent={"secondary"}
            placeholder="8"
            disabled={asset ? true : false}
            compOutClass=""
            type="number"
            value={newToken.decimal}
            onChange={onChangeDecimal}
          />
        </div>
        {asset && (
          <div className="flex flex-col items-start w-full mb-3">
            <p>{t("short.form.limit")}</p>
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
        <div className="flex flex-row justify-end w-full gap-4">
          {!asset && (
            <CustomButton
              intent={newToken.address.length > 5 ? "success" : "deny"}
              onClick={onTest}
              disabled={newToken.address.length <= 5}
            >
              {testLoading ? <LoadingLoader className="mt-1" /> : t("test")}
            </CustomButton>
          )}
          <CustomButton
            intent={newToken.address.length > 5 ? "accept" : "deny"}
            onClick={onSave}
            disabled={newToken.address.length <= 5 || newToken.name === "" || newToken.symbol === ""}
          >
            {t("save")}
          </CustomButton>
        </div>
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

  async function onTest() {
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

        setNewToken((prev: any) => {
          return {
            ...prev,
            decimal: decimals.toFixed(0),
            shortDecimal: decimals.toFixed(0),
            symbol: symbol,
            name: name,
            logo: logo,
            tokenSymbol: symbol,
            tokenName: name,
            fee: fee,
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
    return validData;
  }

  async function onSave() {
    if (asset) {
      if (newToken.shortDecimal === "") {
        serErrShortDec(true);
        return;
      }
      // Change contacts local and reducer
      dispatch(editAssetName(asset.tokenSymbol, newToken.symbol));
      // List all tokens modifying the one we selected
      const auxTokens = tokens.map((tkn) => {
        if (tkn.id_number === newToken.id_number) {
          return {
            ...newToken,
            decimal: Number(newToken.decimal).toFixed(0),
            shortDecimal:
              newToken.shortDecimal === ""
                ? Number(newToken.decimal).toFixed(0)
                : Number(newToken.shortDecimal).toFixed(0),
          };
        } else return tkn;
      });
      // Save tokens in list to local
      saveInLocalStorage(auxTokens);
      // Edit tokens list and assets list
      dispatch(editToken(newToken, asset.tokenSymbol));
      setAssetOpen(false);
    } else if (await onTest()) addAssetToData();
  }
};

export default AddAssetManual;
