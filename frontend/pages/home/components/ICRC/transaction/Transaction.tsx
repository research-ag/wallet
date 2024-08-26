// svgs
import { ReactComponent as DownBlueArrow } from "@assets/svg/files/down-blue-arrow.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AssetSymbolEnum, SpecialTxTypeEnum } from "@/common/const";
import { Principal } from "@dfinity/principal";
import { AccountHook } from "@pages/hooks/accountHook";
import { CustomCopy } from "@components/tooltip";
import { useAppSelector } from "@redux/Store";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { getAssetSymbol, getICRC1Acc, shortAddress } from "@common/utils/icrc";
import { toFullDecimal } from "@common/utils/amount";
import logger from "@/common/utils/logger";
import { middleTruncation } from "@common/utils/strings";
import moment from "moment";

const DrawerTransaction = () => {
  const { t } = useTranslation();

  const { authClient } = AccountHook();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { ICPSubaccounts } = useAppSelector((state) => state.asset);
  const { selectedAccount, selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { selectedTransaction } = useAppSelector((state) => state.transaction);

  const assetSymbol = getAssetSymbol(selectedTransaction?.symbol || "", assets);

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-start w-full h-full pt-4 mt-4 text-md text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/70">
        {/* FROM SECTION */}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.mint && (
          <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 p-4 bg-secondary-color-1-light dark:bg-level-1-color">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("from")}</p>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.principal")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${
                  hasSub(false) && getPrincipal(false) ? shortAddress(getPrincipal(false) || "", 12, 12) : t("unknown")
                }`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getPrincipal(false)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.subacc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(false) ? middleTruncation(getSub(false), 8, 8) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getSub(false).substring(2)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("icrc.acc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(false) ? shortAddress(getICRCAccount(false), 12, 12) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={hasSub(false) ? getICRCAccount(false) : ""}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            {selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP && (
              <div className="flex flex-row items-center justify-between w-full font-normal">
                <p>{`${t("acc.identifier")}`}</p>
                <div className="flex flex-row items-center justify-start gap-2">
                  <p>{`${shortAddress(getIdentifier(false), 12, 12)}`}</p>
                  <CustomCopy
                    size={"small"}
                    copyText={getIdentifier(false)}
                    copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                    isTransaction={true}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{t("transaction.amount")}</p>
              <p className="">{`${toFullDecimal(
                BigInt(selectedTransaction?.amount || "0") + BigInt(selectedAccount?.transaction_fee || "0"),
                selectedAccount?.decimal || 8,
              )} ${assetSymbol || selectedAsset?.symbol || t("unknown")}`}</p>
            </div>
          </div>
        )}

        {/* ARROW SECTION */}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.burn &&
          selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.mint && <DownBlueArrow className="my-3"></DownBlueArrow>}
        {/* TO SECTION */}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.burn && (
          <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 p-4 bg-secondary-color-1-light dark:bg-level-1-color rounded-md">
            <div className="flex flex-row items-center justify-between w-full">
              <p className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("to")}</p>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.principal")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${
                  hasSub(true) && getPrincipal(true) ? shortAddress(getPrincipal(true) || "", 12, 12) : t("unknown")
                }`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getPrincipal(true) || t("unknown")}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("acc.subacc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(true) ? middleTruncation(getSub(true), 8, 8) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getSub(true).substring(2)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{`${t("icrc.acc")}`}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p>{`${hasSub(true) ? shortAddress(getICRCAccount(true), 12, 12) : t("unknown")}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getICRCAccount(true)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
            {selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP && (
              <div className="flex flex-row items-center justify-between w-full font-normal">
                <p>{`${t("acc.identifier")}`}</p>
                <div className="flex flex-row items-center justify-start gap-2">
                  <p>{`${shortAddress(getIdentifier(true), 12, 12)}`}</p>
                  <CustomCopy
                    size={"small"}
                    copyText={getIdentifier(true)}
                    copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                    isTransaction={true}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p>{t("transaction.amount")}</p>
              <p className="">{`${toFullDecimal(
                BigInt(selectedTransaction?.amount || "0"),
                selectedAccount?.decimal || 8,
              )} ${assetSymbol || selectedAsset?.symbol || t("unknown")}`}</p>
            </div>
          </div>
        )}
        {selectedTransaction?.kind !== SpecialTxTypeEnum.Enum.mint && (
          <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 mt-5 p-4 bg-secondary-color-1-light dark:bg-level-1-color rounded-md">
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p className="font-bold">{t("fee")}</p>
              <p className="font-bold">{`${toFullDecimal(
                BigInt(selectedAccount?.transaction_fee || "0"),
                selectedAccount?.decimal || 8,
              )} ${assetSymbol || selectedAsset?.symbol || t("unknown")}`}</p>
            </div>
          </div>
        )}
        {selectedTransaction?.timestamp && (
          <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 mt-5 p-4 bg-secondary-color-1-light dark:bg-level-1-color rounded-md">
            <div className="flex flex-row items-center justify-between w-full font-normal">
              <p className="font-bold">{t("date")}</p>
              <div className="flex flex-row items-center justify-start gap-2">
                <p className="font-bold">{moment(selectedTransaction?.timestamp).format("MM/DD/YYYY hh:mm")}</p>
                <CustomCopy
                  size={"small"}
                  copyText={selectedTransaction.timestamp.toString()}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );

  function hasSub(to: boolean) {
    return (
      selectedTransaction?.symbol !== AssetSymbolEnum.Enum.ICP ||
      ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
    );
  }

  function isICPWithSub(to: boolean) {
    return (
      selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP &&
      ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
    );
  }

  function getIdentifier(to: boolean) {
    if (selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP) {
      if (to) return selectedTransaction?.to || "";
      else return selectedTransaction?.from || "";
    } else
      return Principal.fromHex(
        to ? selectedTransaction?.identityTo || "" : selectedTransaction?.identityFrom || "",
      ).toString();
  }

  function getPrincipal(to: boolean) {
    if (isICPWithSub(to)) return authClient;
    if (to && selectedTransaction?.to) return selectedTransaction?.to;
    if (!to && selectedTransaction?.from) return selectedTransaction?.from;
    return undefined;
  }

  function getSub(to: boolean) {
    if (isICPWithSub(to)) {
      const subaccount = ICPSubaccounts.find(
        (sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from),
      )?.sub_account_id;
      return subaccount || "0x0";
    } else if (to) return selectedTransaction?.toSub || "0x0";
    else return selectedTransaction?.fromSub || "0x0";
  }

  function getICRCAccount(to: boolean): string {
    try {
      if (!getPrincipal(to)) return t("unknown");

      return getICRC1Acc({
        owner: Principal.fromText(getPrincipal(to) || ""),
        subaccount: hexToUint8Array(getSub(to)),
      });
    } catch (error) {
      logger.debug("Error getting ICRC1 account", error);
      return getPrincipal(to) || "";
    }
  }
};

export default DrawerTransaction;
