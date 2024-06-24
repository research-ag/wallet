import { AssetSymbolEnum, SpecialTxTypeEnum } from "@/common/const";
import { getAddress, shortAddress } from "@common/utils/icrc";
import { middleTruncation } from "@common/utils/strings";
import { AccountHook } from "@pages/hooks/accountHook";
import { useAppSelector } from "@redux/Store";
import { Transaction } from "@redux/models/AccountModels";
import { clsx } from "clsx";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

interface CodeElementProps {
  tx: Transaction;
}

const CodeElement = ({ tx }: CodeElementProps) => {
  const { t } = useTranslation();

  const accId = clsx("text-primary-color/60");
  const { authClient } = AccountHook();

  const { ICPSubaccounts } = useAppSelector((state) => state.asset);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { selectedAccount } = useAppSelector((state) => state.asset.helper);

  const { contacts } = useAppSelector((state) => state.contacts);
  const { services } = useAppSelector((state) => state.services);

  const isTo = getAddress(
    tx.type,
    tx.from || "",
    tx.fromSub || "",
    selectedAccount?.address || "",
    selectedAccount?.sub_account_id || "",
  );
  const hasSub =
    tx?.symbol !== AssetSymbolEnum.Enum.ICP || ICPSubaccounts.find((sub) => sub.legacy === (isTo ? tx.to : tx.from));
  const isICPWithSub =
    tx?.symbol === AssetSymbolEnum.Enum.ICP && ICPSubaccounts.find((sub) => sub.legacy === (isTo ? tx.to : tx.from));

  let iAm = false;
  let hasSubName = false;
  let subName = "";

  let hasContactName = false;
  let contactName = "";

  if (tx?.symbol !== AssetSymbolEnum.Enum.ICP) {
    iAm = authClient === (isTo ? tx.to || "" : tx.from || "");
    if (iAm) {
      const symbolAsst = assets.find((asst) => asst.tokenSymbol === tx?.symbol)?.subAccounts;
      if (symbolAsst && symbolAsst?.length > 0) {
        const subAcc = isTo ? tx.toSub || "0" : tx.fromSub || "0";
        const subNameAux = symbolAsst.find((sa) => sa.sub_account_id === subAcc)?.name;
        if (subNameAux && subNameAux != "-") {
          hasSubName = true;
          subName = subNameAux;
        }
      }
    }

    const contact = contacts.find((cntc) => cntc.principal === (isTo ? tx.to || "" : tx.from || ""));
    if (contact) {
      hasContactName = true;
      contactName = contact.name;

      const symbolAsst = contact.accounts.filter((acc) => acc.tokenSymbol === tx.symbol);
      if (symbolAsst && symbolAsst?.length > 0) {
        const subAcc = isTo ? tx.toSub || "0" : tx.fromSub || "0";
        const subNameAux = symbolAsst.find((sa) => `0x${sa.subaccountId}` === subAcc)?.name;
        if (subNameAux) {
          hasSubName = true;
          subName = subNameAux;
        }
      }
    } else {
      const service = services.find((cntc) => cntc.principal === (isTo ? tx.to || "" : tx.from || ""));
      if (service) {
        hasContactName = true;
        contactName = service.name;
      }
    }
  } else {
    iAm = isICPWithSub ? true : false;
    if (iAm) {
      const symbolAsst = assets.find((asst) => asst.tokenSymbol === tx?.symbol)?.subAccounts;
      if (symbolAsst && symbolAsst?.length > 0) {
        const subAcc = ICPSubaccounts.find((sub) => sub.legacy === (isTo ? tx.to : tx.from));
        if (subAcc) {
          const subNameAux = symbolAsst.find((sa) => sa.sub_account_id === subAcc.sub_account_id)?.name;
          if (subNameAux && subNameAux != "-") {
            hasSubName = true;
            subName = subNameAux;
          }
        }
      }
    }

    const contact = contacts.find((cntc) => cntc.accountIdentifier === (isTo ? tx.to || "" : tx.from || ""));
    if (contact) {
      hasContactName = true;
      contactName = contact.name;
    }
    const symbolAsst = assets.find((asst) => asst.tokenSymbol === tx?.symbol)?.subAccounts;
    if (symbolAsst && symbolAsst?.length > 0) {
      const subAcc = ICPSubaccounts.find((sub) => sub.legacy === (isTo ? tx.to : tx.from));
      const subNameAux = symbolAsst.find((sa) => sa.sub_account_id === subAcc?.sub_account_id)?.name;
      if (subNameAux) {
        hasSubName = true;
        subName = subNameAux;
      }
    }
  }

  // tailwind CSS
  const contcNameStyle = clsx("text-left break-words w-full max-w-[30vw]");

  return (
    <Fragment>
      {tx.kind === SpecialTxTypeEnum.Enum.mint || tx.kind === SpecialTxTypeEnum.Enum.burn ? (
        <div className="flex flex-col items-start justify-center w-full my-2 min-h-12">
          <p className={contcNameStyle}>{tx.kind === SpecialTxTypeEnum.Enum.mint ? "Mint" : "Burn"}</p>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-center w-full my-2 min-h-12">
          {hasContactName ? (
            <p
              data-popover-target="popover-default"
              className={contcNameStyle}
              data-toggle="popover"
              data-trigger="hover"
              title={isICPWithSub ? authClient : isTo ? tx.to || "" : tx.from || ""}
            >{`${isTo ? t("to") : t("from")}: ${contactName}`}</p>
          ) : (
            <p className={contcNameStyle}>
              {`${isTo ? t("to") : t("from")}: ${shortAddress(
                isICPWithSub ? authClient : isTo ? tx.to || "" : tx.from || "",
                12,
                12,
              )}`}
            </p>
          )}
          {hasSub &&
            (subName.trim() === "" ? (
              <p className={`${accId} text-left break-words max-w-[20.5rem]`}>
                {`${hasSubName ? subName + " -" : ""} ${getTitle()} `}
              </p>
            ) : (
              <p
                className={`${accId} text-left break-words max-w-[20.5rem]`}
                data-toggle="popover"
                data-trigger="hover"
                title={getTitle()}
              >
                {subName}
              </p>
            ))}
        </div>
      )}
    </Fragment>
  );

  function getTitle() {
    return middleTruncation(
      isICPWithSub
        ? ICPSubaccounts.find((sub) => sub.legacy === (isTo ? tx.to : tx.from))?.sub_account_id || "0x0"
        : isTo
        ? tx.toSub || "0"
        : tx.fromSub || "0",
      6,
      4,
    );
  }
};

export default CodeElement;
