import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";
import SubAccountContactBook from "./SubAccountContactBook";
import NewSender from "./NewSender";
import { useTranslation } from "react-i18next";
import ServiceTransferInfo from "./ServiceTransferInfo";

export default function SenderDetail() {
  const { t } = useTranslation();
  const { sender } = useAppSelector((state) => state.transaction);

  const isSubAccountOrContactBook = useMemo(() => {
    return !sender?.newAllowanceContact?.subAccountId;
  }, [sender]);

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {`${t("from")} ${sender.serviceSubAccount.servicePrincipal ? t("service") : ""}`}
      </p>
      {sender.serviceSubAccount.servicePrincipal ? (
        <ServiceTransferInfo service={sender.serviceSubAccount} />
      ) : isSubAccountOrContactBook ? (
        <SubAccountContactBook />
      ) : (
        <NewSender />
      )}
    </>
  );
}
