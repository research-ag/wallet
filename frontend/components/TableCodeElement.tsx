import { AssetSymbolEnum } from "@/const";
import { getAddress, shortAddress } from "@/utils";
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

  const accId = clsx("text-SelectRowColor opacity-60");
  const { authClient } = AccountHook();

  const { selectedAccount, ICPSubaccounts, assets } = useAppSelector((state) => state.asset);
  const { contacts } = useAppSelector((state) => state.contacts);

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
      const symbolAsst = contact.assets.find((asst) => asst.tokenSymbol === tx?.symbol)?.subaccounts;
      if (symbolAsst && symbolAsst?.length > 0) {
        const subAcc = isTo ? tx.toSub || "0" : tx.fromSub || "0";
        const subNameAux = symbolAsst.find((sa) => sa.subaccount_index === subAcc)?.name;
        if (subNameAux) {
          hasSubName = true;
          subName = subNameAux;
        }
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

    const contact = contacts.find((cntc) => cntc.accountIdentier === (isTo ? tx.to || "" : tx.from || ""));
    if (contact) {
      hasContactName = true;
      contactName = contact.name;
    }
  }

  // tailwind CSS
  const contcNameStyle = clsx("text-left break-words w-full max-w-[30vw]");

  return (
    <Fragment>
      <div className="flex flex-col items-start justify-center w-full my-2 min-h-12">
        {hasContactName ? (
          <p className={contcNameStyle}>{`${isTo ? t("to") : t("from")}: ${contactName}`}</p>
        ) : (
          <p className={contcNameStyle}>
            {`${isTo ? t("to") : t("from")}: ${shortAddress(
              isICPWithSub ? authClient : isTo ? tx.to || "" : tx.from || "",
              12,
              12,
            )}`}
          </p>
        )}
        {hasContactName && (
          <p className="opacity-75 text-left break-words max-w-[20.5rem]">
            {`${shortAddress(isICPWithSub ? authClient : isTo ? tx.to || "" : tx.from || "", 12, 12)}`}
          </p>
        )}
        {hasSub && (
          <p className={`${accId} text-left break-words max-w-[20.5rem]`}>
            {`${hasSubName ? subName + " -" : ""} ${
              isICPWithSub
                ? ICPSubaccounts.find((sub) => sub.legacy === (isTo ? tx.to : tx.from))?.sub_account_id || "0x0"
                : isTo
                ? tx.toSub || "0"
                : tx.fromSub || "0"
            } `}
          </p>
        )}
      </div>
    </Fragment>
  );
};

export default CodeElement;
