// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { ReactComponent as InfoIcon } from "@assets/svg/files/info-icon.svg";
import ChevIcon from "@assets/svg/files/chev-icon.svg";
//
import { Fragment, useEffect } from "react";
import { CustomInput } from "@components/Input";
import { CustomButton } from "@components/Button";
import { useTranslation } from "react-i18next";
import { IdentityHook } from "@pages/hooks/identityHook";
import { IcrcLedgerCanister } from "@dfinity/ledger";
import { getMetadataInfo } from "@/utils";
import { addToken, editToken } from "@redux/assets/AssetReducer";
import { GeneralHook } from "../hooks/generalHook";
import Modal from "@components/Modal";
import { AccountDefaultEnum, AddingAssetsEnum, IconTypeEnum, TokenNetworkEnum } from "@/const";
import { TokenHook } from "../hooks/tokenHook";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { clsx } from "clsx";
import { Asset } from "@redux/models/AccountModels";
import { AccountHook } from "@pages/hooks/accountHook";
import { CustomCopy } from "@components/CopyTooltip";
import { Token } from "@redux/models/TokenModels";
import { AssetHook } from "../hooks/assetHook";
import { useAppDispatch } from "@redux/Store";
import { editAssetName } from "@redux/contacts/ContactsReducer";
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

  const { authClient } = AccountHook();
  const { getAssetIcon } = GeneralHook();
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
  const { reloadBallance } = AssetHook();
  const { checkAssetAdded } = GeneralHook();
  const { userAgent } = IdentityHook();

  useEffect(() => {
    setErrToken("");
    setValidToken(false);
  }, [assetOpen]);

  const getMessage = (status: string) => {
    switch (status) {
      case AddingAssetsEnum.Enum.adding:
        return { top: "", botton: t("adding.asset") };
      case AddingAssetsEnum.Enum.done:
        return { top: t("congrats"), botton: t("adding.asset.successful") };
      case AddingAssetsEnum.Enum.error:
        return { top: t("error"), botton: t("adding.asset.failed") };

      default:
        return { top: t("adding.asset"), botton: "" };
    }
  };

  const saveInLocalStorage = (tokens: Token[]) => {
    localStorage.setItem(
      authClient,
      JSON.stringify({
        from: "II",
        tokens: tokens.sort((a, b) => {
          return a.id_number - b.id_number;
        }),
      }),
    );
  };

  const addAssetToData = () => {
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
  };

  // Tailwind CSS constants
  const networkBox = clsx(
    "flex",
    "flex-row",
    "w-full",
    "justify-between",
    "items-start",
    "rounded",
    "border border-BorderSuccessColor",
    "px-3",
    "py-1",
  );

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-center bg-PrimaryColorLight dark:bg-PrimaryColor w-full h-full pt-8 px-6 text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
        <div className="flex flex-row justify-between items-center w-full mb-5">
          <p className="text-lg font-bold">{asset ? t("edit.asset") : t("add.asset")}</p>
          <CloseIcon
            className="stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor cursor-pointer"
            onClick={() => {
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
            }}
          />
        </div>
        {manual || asset ? (
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
                  setNewToken((prev) => {
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
                  setNewToken((prev) => {
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
                    setNewToken((prev) => {
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
                  setNewToken((prev) => {
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
                  setNewToken((prev) => {
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
                          setNewToken((prev) => {
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
                      dispatch(editAssetName(asset.tokenSymbol, newToken.symbol));
                      const auxTokens = tokens.map((tkn) => {
                        if (tkn.id_number === newToken.id_number) {
                          return newToken;
                        } else return tkn;
                      });
                      saveInLocalStorage(auxTokens);
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
        ) : (
          <div className="flex flex-col justify-start items-start w-full">
            <div className="flex flex-row justify-start items-center w-full gap-4">
              <div className="flex flex-col justify-start items-start w-1/2">
                <p className="w-full text-left opacity-60">{t("network")}</p>
                <DropdownMenu.Root
                  onOpenChange={(e: boolean) => {
                    setNetworkTOpen(e);
                  }}
                >
                  <DropdownMenu.Trigger asChild>
                    <div
                      className={clsx(
                        networkBox,
                        "border-BorderColorLight dark:border-BorderColor",
                        "items-center",
                        "cursor-pointer",
                        "!w-full",
                        "pr-0",
                      )}
                    >
                      <div>
                        <p>{network}</p>
                      </div>
                      <img
                        src={ChevIcon}
                        style={{ width: "2rem", height: "2rem" }}
                        alt="chevron-icon"
                        className={`${networkTOpen ? "rotate-90" : ""}`}
                      />
                    </div>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal className="w-full">
                    <DropdownMenu.Content
                      className="text-lg bg-PrimaryColorLight w-[8rem] rounded-lg dark:bg-SecondaryColor z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor"
                      sideOffset={2}
                      align="end"
                    >
                      {TokenNetworkEnum.options.map((sa, idx) => {
                        return (
                          <DropdownMenu.Item
                            key={`net-${idx}`}
                            className={`flex flex-row text-md justify-start items-center p-3 cursor-pointer ${
                              idx > 0 ? "border-t border-BorderColorLight dark:border-BorderColor" : ""
                            }`}
                            onSelect={() => {
                              setNetwork(sa);
                              if (sa !== network)
                                setNewToken({
                                  address: "",
                                  symbol: "",
                                  name: "",
                                  decimal: "",
                                  subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default }],
                                  index: "",
                                  id_number: 999,
                                });
                            }}
                          >
                            <div className="flex flex-col justify-center items-start">
                              <p>{`${sa}`}</p>
                            </div>
                          </DropdownMenu.Item>
                        );
                      })}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
              <div className="flex flex-col justify-start items-start w-full">
                <p className="w-full text-left opacity-60">{t("asset")}</p>
                <DropdownMenu.Root
                  onOpenChange={(e: boolean) => {
                    setAssetTOpen(e);
                  }}
                >
                  <DropdownMenu.Trigger asChild>
                    <div
                      className={clsx(
                        networkBox,
                        "border-BorderColorLight dark:border-BorderColor",
                        "items-center",
                        "cursor-pointer",
                        "!w-full",
                        "pr-0",
                      )}
                    >
                      {newToken.symbol != "" ? (
                        <div className="flex flex-row justify-start items-center">
                          {getAssetIcon(IconTypeEnum.Enum.ASSET, newToken.symbol, newToken.logo)}
                          <p className="ml-3">{`${newToken.symbol}`}</p>
                        </div>
                      ) : (
                        <p className="opacity-70">{t("adding.select")}</p>
                      )}
                      <img
                        src={ChevIcon}
                        style={{ width: "2rem", height: "2rem" }}
                        alt="chevron-icon"
                        className={`${assetTOpen ? "rotate-90" : ""}`}
                      />
                    </div>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal className="w-full">
                    <DropdownMenu.Content
                      className="text-lg bg-PrimaryColorLight w-[16rem] rounded-lg dark:bg-SecondaryColor z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo border border-BorderColorLight dark:border-BorderColor"
                      sideOffset={2}
                      align="end"
                    >
                      {newAssetList.map((newAsset, idx) => {
                        return (
                          <DropdownMenu.Item
                            key={`net-${idx}`}
                            className={`flex flex-row text-md justify-start items-center p-3 cursor-pointer ${
                              idx > 0 ? "border-t border-BorderColorLight dark:border-BorderColor" : ""
                            }`}
                            onSelect={() => {
                              setNewToken(newAsset);
                              setErrToken("");
                              setValidToken(true);
                            }}
                          >
                            <div className="flex flex-row justify-start items-center">
                              {getAssetIcon(IconTypeEnum.Enum.ASSET, newAsset.symbol, newToken.logo)}
                              <p className="ml-3">{`${newAsset.symbol}`}</p>
                            </div>
                          </DropdownMenu.Item>
                        );
                      })}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
            {errToken !== "" && <p className="text-LockColor text-right text-sm w-full">{errToken}</p>}
            <div className="w-full flex flex-row justify-between items-center mt-2 mb-4">
              <CustomButton
                intent={"noBG"}
                className="!font-light !p-0 mt-3"
                onClick={() => {
                  setManual(true);
                  setNewToken({
                    address: "",
                    symbol: "",
                    name: "",
                    decimal: "",
                    subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default }],
                    index: "",
                    id_number: 999,
                  });
                }}
              >
                {t("add.asset.manually")}
              </CustomButton>
              <CustomButton
                className="min-w-[5rem]"
                onClick={async () => {
                  newToken.address.trim() !== "" && addAssetToData();
                }}
              >
                <p>{t("add")}</p>
              </CustomButton>
            </div>
          </div>
        )}
      </div>
      {modal && (
        <Modal
          open={modal}
          width="w-[18rem]"
          padding="py-3 px-1"
          border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
        >
          <div className="reative flex flex-col justify-start items-center w-full">
            <CloseIcon
              className="absolute top-5 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
              onClick={() => {
                showModal(false);
                setAssetOpen(false);
                setNetwork(TokenNetworkEnum.enum["ICRC-1"]);
                setNewToken({
                  address: "",
                  symbol: "",
                  decimal: "",
                  name: "",
                  subAccounts: [{ numb: "0x0", name: "Default" }],
                  index: "",
                  id_number: 999,
                });
                setManual(false);
              }}
            />
            <div className="flex flex-col justify-start items-center w-full py-2">
              {getAssetIcon(IconTypeEnum.Enum.ASSET, newToken?.symbol, newToken.logo)}
              <p
                className={`text-lg font-semibold mt-3 ${
                  addStatus === AddingAssetsEnum.Enum.done ? "text-TextReceiveColor" : "text-TextSendColor"
                }`}
              >
                {getMessage(addStatus).top}
              </p>
              <p className="text-lg font-semibold mt-3">{getMessage(addStatus).botton}</p>
            </div>
          </div>
        </Modal>
      )}
    </Fragment>
  );
};

export default AddAsset;
