import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";
import useSend from "@pages/home/hooks/useSend";
import OwnSubAccountCard from "./OwnSubAccountCard";
import ReceiverThirdPartyCard from "./ReceiverThirdPartyCard";
import { useMemo } from "react";
import { toFullDecimal } from "@common/utils/amount";
import ServiceTransferInfo from "./ServiceTransferInfo";

export default function ReceiverDetail() {
  const { t } = useTranslation();
  const { assets } = useAppSelector((state) => state.asset.list);
  const { receiver, sender } = useAppSelector((state) => state.transaction);
  const { isReceiverOwnSubAccount, receiverSubAccount, getReceiverBalance } = useSend();

  const subAccountName = useMemo(() => receiver?.ownSubAccount?.name, []);

  const balance = useMemo(() => {
    const latestAsset = assets.find((asset) => asset?.tokenSymbol === sender?.asset?.tokenSymbol);
    const latestSubAccount = latestAsset?.subAccounts.find(
      (subAccount) => subAccount?.sub_account_id === receiver.ownSubAccount.sub_account_id,
    );

    if (!latestSubAccount?.amount) return null;
    return toFullDecimal(latestSubAccount.amount, Number(latestAsset?.decimal)) || "0";
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

  const assetSymbol = useMemo(() => {
    return assets.find((asset) => asset.tokenSymbol === sender?.asset?.tokenSymbol)?.symbol;
  }, [assets]);

  return (
    <>
      <p className="font-bold opacity-50 text-md text-start text-PrimaryTextColorLight dark:text-PrimaryTextColor">
        {`${t("to")} ${receiver.serviceSubAccount.servicePrincipal ? t("service") : ""}`}
      </p>
      {receiver.serviceSubAccount.servicePrincipal ? (
        <ServiceTransferInfo service={receiver.serviceSubAccount} />
      ) : isReceiverOwnSubAccount ? (
        <OwnSubAccountCard
          subAccountName={subAccountName || receiverSubAccount || "-"}
          balance={balance || getReceiverBalance() || "0"}
          assetLogo={sender?.asset?.logo || ""}
          assetSymbol={sender?.asset?.tokenSymbol || ""}
          symbol={assetSymbol || ""}
        />
      ) : (
        <ReceiverThirdPartyCard title={title} subTitle={subTitle} />
      )}
    </>
  );
}
