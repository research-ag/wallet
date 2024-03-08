import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";
import useSend from "@pages/home/hooks/useSend";
import OwnSubAccountCard from "./OwnSubAccountCard";
import ReceiverThirdPartyCard from "./ReceiverThirdPartyCard";
import { useMemo } from "react";
import { toFullDecimal } from "@/utils";

export default function ReceiverDetail() {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset);
  const { receiver, sender } = useAppSelector((state) => state.transaction);
  const { isReceiverOwnSubAccount } = useSend();

  const subAccountName = useMemo(() => receiver?.ownSubAccount?.name, []);

  const balance = useMemo(() => {
    const latestAsset = assets.find((asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol);
    const latestSubAccount = latestAsset?.subAccounts.find(
      (subAccount) => subAccount?.sub_account_id === receiver.ownSubAccount.sub_account_id,
    );

    return toFullDecimal(latestSubAccount?.amount || "0", Number(latestAsset?.decimal)) || "0";
  }, [assets, receiver, sender]);

  const title = useMemo(
    () =>
      `${
        receiver?.ownSubAccount?.name ||
        receiver?.thirdNewContact?.subAccountId ||
        `${receiver?.thirdContactSubAccount?.contactName} [${receiver?.thirdContactSubAccount?.subAccountId}]`
      }`,
    [receiver],
  );

  const subTitle = useMemo(
    () =>
      `${
        receiver?.ownSubAccount?.address ||
        receiver?.thirdContactSubAccount?.contactPrincipal ||
        receiver?.thirdNewContact?.principal
      }`,
    [receiver],
  );

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start">{t("to")}</p>
      {isReceiverOwnSubAccount ? (
        <OwnSubAccountCard
          subAccountName={subAccountName}
          balance={balance}
          assetLogo={sender?.asset?.logo || ""}
          assetSymbol={sender?.asset?.tokenSymbol || ""}
        />
      ) : (
        <ReceiverThirdPartyCard title={title} subTitle={subTitle} />
      )}
    </>
  );
}
