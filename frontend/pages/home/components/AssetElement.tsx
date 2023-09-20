// svgs
import ChevronRightIcon from "@assets/svg/files/chevron-right-icon.svg";
import ChevronRightDarkIcon from "@assets/svg/files/chevron-right-dark-icon.svg";
import InfoIcon from "@assets/svg/files/info-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { SubAccount, Asset } from "@redux/models/AccountModels";
import AccountElement from "./AccountElement";
import { Fragment, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { GeneralHook } from "../hooks/generalHook";
import { ThemeHook } from "@hooks/themeHook";
import { IconTypeEnum, ThemesEnum } from "@/const";
import {
  checkHexString,
  getFirstNChars,
  getUSDfromToken,
  hexToNumber,
  removeLeadingZeros,
  toFullDecimal,
} from "@/utils";
import { AssetHook } from "../hooks/assetHook";
import { Token } from "@redux/models/TokenModels";
import Modal from "@components/Modal";
import { CustomInput } from "@components/Input";
import { CustomCheck } from "@components/CheckBox";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/Button";
import { AccountHook } from "@pages/hooks/accountHook";
import { addSubAccount } from "@redux/assets/AssetReducer";
import { useAppDispatch } from "@redux/Store";
import bigInt from "big-integer";

interface AssetElementProps {
  asset: Asset;
  idx: number;
  acordeonIdx: string;
  setAssetInfo(value: Asset | undefined): void;
  setAssetOpen(value: boolean): void;
  tokens: Token[];
}

const AssetElement = ({ asset, idx, acordeonIdx, setAssetInfo, setAssetOpen, tokens }: AssetElementProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { theme } = ThemeHook();
  const { authClient } = AccountHook();
  const { assets, selectedAsset, changeSelectedAsset, changeSelectedAccount, getAssetIcon, asciiHex } = GeneralHook();
  const { editNameId, setEditNameId, name, setName, newSub, setNewSub, hexChecked, setHexChecked, tokensMarket } =
    AssetHook();
  const [usedIdxs, setUsedIdxs] = useState<string[]>([]);
  const [newErr, setNewErr] = useState<{ name: boolean; idx: boolean }>({ name: false, idx: false });

  const saveLocalStorage = (auxTokens: Token[]) => {
    localStorage.setItem(
      authClient,
      JSON.stringify({
        from: "II",
        tokens: auxTokens.sort((a, b) => {
          return a.id_number - b.id_number;
        }),
      }),
    );
  };

  const getFullTokenAmount = () => {
    const assetMarket = tokensMarket.find((tm) => tm.symbol === asset.tokenSymbol);
    const assetTotal = asset.subAccounts.reduce((count, sa) => {
      return count + Number(sa.amount);
    }, 0);

    const power = Math.pow(10, Number(asset.decimal));
    const currencyTotal = assetMarket ? getUSDfromToken(assetTotal * power, assetMarket.price, asset.decimal) : "0.00";

    return {
      token: assetTotal,
      currency: Number(currencyTotal),
    };
  };

  const onEnter = () => {
    if (newSub) {
      const subClean = removeLeadingZeros(
        newSub.sub_account_id.slice(0, 2).toLowerCase() === "0x"
          ? newSub.sub_account_id.substring(2)
          : newSub.sub_account_id,
      );
      let errName = false;
      let errIdx = false;
      if (newSub.name.trim() === "") errName = true;
      const checkedIdx = subClean === "" ? "0x0" : `0x${subClean}`;
      if (usedIdxs.includes(checkedIdx.toLowerCase())) {
        errIdx = true;
      }
      if (!errName && !errIdx) {
        const auxTokens = tokens.map((tkn, k) => {
          if (k === Number(idx)) {
            return {
              ...tkn,
              subAccounts: [
                ...tkn.subAccounts,
                {
                  name: newSub.name,
                  numb: `0x${subClean}`.toLowerCase(),
                },
              ].sort((a, b) => {
                return hexToNumber(a.numb)?.compare(hexToNumber(b.numb) || bigInt()) || 0;
              }),
            };
          } else return tkn;
        });
        saveLocalStorage(auxTokens);
        dispatch(
          addSubAccount(idx, {
            ...newSub,
            sub_account_id: `0x${subClean}`.toLowerCase(),
          }),
        );
        setNewSub(undefined);
        setHexChecked(false);
      } else {
        setNewErr({ name: errName, idx: errIdx });
      }
    }
  };

  const getLowestMissing = (idxs: string[]) => {
    let lowestMissing = bigInt();
    for (let index = 0; index < idxs.length; index++) {
      const saId = hexToNumber(idxs[index]) || bigInt();
      const newId = hexToNumber(`0x${index.toString(16)}`) || bigInt();
      if (saId.compare(newId) !== 1) lowestMissing = saId.add(bigInt(1));
    }
    return lowestMissing;
  };

  return (
    <Fragment>
      <Accordion.Item value={`asset-${idx}`}>
        <div
          className={`relative flex flex-row items-center w-full h-16 text-PrimaryColor dark:text-PrimaryColorLight cursor-pointer hover:bg-SecondaryColorLight dark:hover:bg-SecondaryColor ${
            asset?.tokenSymbol === selectedAsset?.tokenSymbol ? "bg-SecondaryColorLight dark:bg-SecondaryColor" : ""
          } ${
            idx < assets?.length ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight" : ""
          }`}
          onClick={() => {
            changeSelectedAsset(asset);
            if (asset?.tokenSymbol !== selectedAsset?.tokenSymbol) {
              setNewSub(undefined);
              asset.subAccounts.length > 0 && changeSelectedAccount(asset.subAccounts[0]);
            }
            setName("");
            setEditNameId("");
          }}
        >
          {asset?.tokenSymbol === selectedAsset?.tokenSymbol && (
            <div className="absolute left-0 bg-[#33b2ef] h-full w-1"></div>
          )}
          <Accordion.Trigger className="flex flex-row justify-center items-center w-full">
            <div className={"flex flex-row justify-between w-full h-full text-md"}>
              <div className="flex flex-row justify-start items-center gap-2">
                {getAssetIcon(IconTypeEnum.Enum.ASSET, asset?.tokenSymbol, asset.logo)}
                <div className="flex flex-col justify-start items-start">
                  <p>{`${getFirstNChars(asset?.name ? asset.name : asset.tokenName, 18)}`}</p>
                  <div className="flex flex-row justify-start items-center">
                    <p className={`${asset?.tokenSymbol !== selectedAsset?.tokenSymbol ? "opacity-60" : ""}`}>{`${
                      asset.symbol ? asset.symbol : asset.tokenSymbol
                    }`}</p>{" "}
                    <div
                      className="p-0"
                      onClick={() => {
                        setAssetInfo(asset);
                        setAssetOpen(true);
                      }}
                    >
                      <img src={InfoIcon} className="ml-1" alt="info-icon" />
                    </div>
                    {asset?.tokenSymbol === selectedAsset?.tokenSymbol ? (
                      <div
                        className="flex flex-row justify-start items-center rounded ml-2 !p-0"
                        onClick={() => {
                          let newIdx = "0";
                          if (asset.subAccounts.length !== 0) {
                            const idxs = asset.subAccounts.map((sa) => {
                              return sa.sub_account_id.toLowerCase();
                            });
                            newIdx = getLowestMissing(idxs).toString(16);
                            setUsedIdxs(idxs);
                          }

                          setNewErr({ name: false, idx: false });
                          setNewSub({
                            name: "",
                            sub_account_id: newIdx,
                            address: authClient,
                            amount: "0",
                            currency_amount: "0",
                            transaction_fee: asset.subAccounts[0].transaction_fee,
                            decimal: Number(asset.decimal),
                            symbol: asset.subAccounts[0].symbol,
                          });
                          setEditNameId(asset.subAccounts.length.toFixed());
                          setName("");
                        }}
                      >
                        <div className="flex justify-center items-center w-full h-5 rounded bg-SvgColorLight/10 dark:bg-SvgColor">
                          <p className="text-sm mx-1">+ Sub</p>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-2">
                        {asset.subAccounts.length > 1 && (
                          <div className="flex justify-center items-center w-full h-5 rounded bg-SvgColorLight/10 dark:bg-SvgColor">
                            <p className="text-sm px-1">{`${asset.subAccounts.length} Subs`}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-end">
                <p>{`${toFullDecimal(getFullTokenAmount().token, asset.decimal)} ${asset.symbol}`}</p>
                <p
                  className={`${asset?.tokenSymbol !== selectedAsset?.tokenSymbol ? "opacity-60" : ""}`}
                >{`≈ $${getFullTokenAmount().currency.toFixed(2)}`}</p>
              </div>
            </div>
            {asset?.subAccounts && (
              <img
                src={theme === ThemesEnum.enum.dark ? ChevronRightIcon : ChevronRightDarkIcon}
                className={`${
                  acordeonIdx === `asset-${idx}` ? "-rotate-90 transition-transform" : "rotate-0 transition-transform"
                } ml-3`}
                alt="chevron-icon"
              />
            )}
          </Accordion.Trigger>
        </div>
        {(asset?.subAccounts || newSub) && (
          <Accordion.Content>
            <div
              className={`flex flex-col justify-start items-end ${
                idx < assets?.length
                  ? "border-b-[0.1rem] dark:border-BorderColorThree border-BorderColorThreeLight"
                  : ""
              }`}
            >
              {asset?.subAccounts.map((subAccount: SubAccount, subIdx: number) => {
                return (
                  <AccountElement
                    key={subIdx}
                    subAccount={subAccount}
                    symbol={asset.symbol}
                    name={name}
                    setName={setName}
                    editNameId={editNameId}
                    setEditNameId={setEditNameId}
                    tokenIndex={idx}
                    newSub={false}
                    setNewSub={setNewSub}
                    tokens={tokens}
                    subaccountId={subIdx}
                  ></AccountElement>
                );
              })}
            </div>
          </Accordion.Content>
        )}
      </Accordion.Item>
      <Modal
        width="w-[18rem]"
        padding="py-5 px-4"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
        open={newSub ? true : false}
      >
        <div className="reative flex flex-col justify-start items-start w-full gap-2">
          <CloseIcon
            className="absolute top-6 right-5 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => {
              setNewSub(undefined);
              setHexChecked(false);
            }}
          />
          <p className="">{t("add.subacc")}</p>
          <CustomInput
            intent={"primary"}
            border={newErr.name ? "error" : "primary"}
            placeholder={t("name.sub.account")}
            value={newSub?.name || ""}
            sizeComp="small"
            sizeInput="small"
            inputClass="!py-1"
            autoFocus
            onChange={(e: { target: { value: string } }) => {
              setNewSub((prev) => {
                if (prev) return { ...prev, name: e.target.value };
              });
              setNewErr((prev) => {
                return { idx: prev.idx, name: false };
              });
            }}
            onKeyUp={(e) => {
              if (e.nativeEvent.key === "Enter") {
                onEnter();
              }
            }}
          />
          <button
            className="p-0 flex flex-row gap-2"
            onClick={() => {
              if (hexChecked) {
                const lowestMissing = getLowestMissing(usedIdxs);
                setNewSub((prev) => {
                  if (prev) return { ...prev, sub_account_id: lowestMissing.toString(16) };
                });
                setNewErr((prev) => {
                  return { name: prev.name, idx: false };
                });
              }
              setHexChecked((prev) => !prev);
            }}
          >
            <CustomCheck className="border-BorderColorLight dark:border-BorderColor" checked={hexChecked} />
            <p className="text-sm">{t("hex.check")}</p>
          </button>
          {hexChecked && (
            <CustomInput
              intent={"primary"}
              border={newErr.idx ? "error" : "primary"}
              placeholder={t("sub-acc")}
              value={newSub?.sub_account_id || ""}
              sizeComp="small"
              sizeInput="small"
              inputClass="!py-1"
              onChange={(e: { target: { value: string } }) => {
                if (checkHexString(e.target.value))
                  setNewSub((prev) => {
                    if (prev) return { ...prev, sub_account_id: e.target.value.trim() };
                  });
                setNewErr((prev) => {
                  return { name: prev.name, idx: false };
                });
              }}
              onKeyUp={(e) => {
                if (e.nativeEvent.key === "Enter") {
                  onEnter();
                }
              }}
              onKeyDown={(e) => {
                if (!asciiHex.includes(e.key)) {
                  e.preventDefault();
                }
                if (newSub?.sub_account_id.includes("0x") || newSub?.sub_account_id.includes("0X")) {
                  if (e.key === "X" || e.key == "x") {
                    e.preventDefault();
                  }
                }
              }}
            />
          )}
          <div className="flex flex-row justify-end items-center w-full">
            <CustomButton
              size={"small"}
              className="min-w-[5rem]"
              onClick={() => {
                onEnter();
              }}
            >
              <p>{t("add")}</p>
            </CustomButton>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default AssetElement;
