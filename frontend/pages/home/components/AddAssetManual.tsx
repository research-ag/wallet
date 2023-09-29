// svgs
import { ReactComponent as InfoIcon } from "@assets/svg/files/info-icon.svg";
//
import { GeneralHook } from "../hooks/generalHook";
import { IcrcLedgerCanister } from "@dfinity/ledger";
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

interface AddAssetManualProps {
  manual: boolean;
  setManual(value: boolean): void;
  errToken: string;
  setErrToken(value: string): void;
  validToken: boolean;
  setValidToken(value: boolean): void;
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
  validToken,
  setValidToken,
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

  const { getAssetIcon, checkAssetAdded } = GeneralHook();
  const { userAgent } = IdentityHook();

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
          onChange={(e) => {
            setErrToken("");
            setNewToken((prev: any) => {
              return { ...prev, address: e.target.value.trim() };
            });
            setValidToken(false);
          }}
        />
        {errToken !== "" && <p className="text-LockColor text-left text-sm">{errToken}</p>}
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
          onChange={(e) => {
            setNewToken((prev: any) => {
              return { ...prev, index: e.target.value };
            });
          }}
        />
      </div>
      <div className="flex flex-col items-start w-full mb-3">
        <p className="opacity-60">{t("token.symbol")}</p>
        <CustomInput
          sizeInput={"medium"}
          intent={"secondary"}
          placeholder="-"
          compOutClass=""
          value={newToken.symbol}
          onChange={(e) => {
            if (e.target.value.length <= 8)
              setNewToken((prev: any) => {
                return { ...prev, symbol: e.target.value };
              });
          }}
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
          onChange={(e) => {
            setNewToken((prev: any) => {
              return { ...prev, name: e.target.value };
            });
          }}
        />
      </div>
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
          onChange={(e) => {
            setNewToken((prev: any) => {
              return { ...prev, decimal: e.target.value };
            });
          }}
        />
      </div>
      <div className="flex flex-row justify-between w-full gap-4">
        {manual && (
          <CustomButton
            intent="deny"
            className="mr-3 min-w-[5rem]"
            onClick={() => {
              setManual(false);
              setNewToken({
                address: "",
                symbol: "",
                name: "",
                decimal: "",
                subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default }],
                index: "",
                id_number: 999,
              });
              setErrToken("");
              setValidToken(false);
            }}
          >
            <p>{t("back")}</p>
          </CustomButton>
        )}
        <div className="flex flex-row justify-end w-full gap-4">
          {!asset && (
            <CustomButton
              intent={newToken.address.length > 5 ? "success" : "deny"}
              onClick={async () => {
                if (checkAssetAdded(newToken.address)) {
                  setErrToken(t("adding.asset.already.imported"));
                  setValidToken(false);
                } else {
                  try {
                    const { metadata } = IcrcLedgerCanister.create({
                      agent: userAgent,
                      canisterId: newToken.address as any,
                    });

                    const myMetadata = await metadata({
                      certified: false,
                    });

                    const { symbol, decimals, name, logo } = getMetadataInfo(myMetadata);
                    setNewToken((prev: any) => {
                      return { ...prev, decimal: decimals.toFixed(0), symbol: symbol, name: name, logo: logo };
                    });
                    setValidToken(true);
                  } catch (e) {
                    setErrToken(`${(e as Error).message} ${t("add.asset.import.error")}`);
                    setValidToken(false);
                  }
                }
              }}
              disabled={newToken.address.length <= 5}
            >
              {t("test")}
            </CustomButton>
          )}
          <CustomButton
            intent={newToken.address.length > 5 ? "accept" : "deny"}
            onClick={async () => {
              if (asset) {
                //change contacts local and reducer
                dispatch(editAssetName(asset.tokenSymbol, newToken.symbol));
                //list all tokens modifying the one we selected
                const auxTokens = tokens.map((tkn) => {
                  if (tkn.id_number === newToken.id_number) {
                    return newToken;
                  } else return tkn;
                });
                //save tokens in list to local
                saveInLocalStorage(auxTokens);
                //edit tokens list and assets list
                dispatch(editToken(newToken, asset.tokenSymbol));
                setAssetOpen(false);
              } else addAssetToData();
            }}
            disabled={newToken.address.length <= 5 || newToken.name === "" || newToken.symbol === ""}
          >
            {t("save")}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default AddAssetManual;