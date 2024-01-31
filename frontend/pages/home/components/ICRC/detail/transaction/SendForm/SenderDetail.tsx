import { useAppSelector } from "@redux/Store";
import { useMemo } from "react";
import SubAccountContactBook from "./SubAccountContactBook";
import NewSender from "./NewSender";
import { useTranslation } from "react-i18next";

export default function SenderDetail() {
  const { t } = useTranslation();
  const { sender } = useAppSelector((state) => state.transaction);

  const isSubAccountOrContactBook = useMemo(() => {
    return !sender?.newAllowanceContact?.subAccountId;
  }, [sender]);

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">{t("from")}</p>
      {isSubAccountOrContactBook ? <SubAccountContactBook /> : <NewSender />}
    </>
  );
}
