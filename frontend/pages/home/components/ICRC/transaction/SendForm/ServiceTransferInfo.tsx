import { useTranslation } from "react-i18next";
import { ServiceSubAccount } from "@/@types/transactions";
import { middleTruncation } from "@common/utils/strings";

interface ServiceTransferInfoProps {
  service: ServiceSubAccount;
}

export default function ServiceTransferInfo(props: ServiceTransferInfoProps) {
  const { service } = props;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-start items-center w-full px-4 py-2 rounded-md dark:bg-secondary-color-2 bg-secondary-color-1-light text-start gap-1 text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/70 text-md">
      <div className="flex flex-row justify-between items-center w-full">
        <p>{t("name")}</p>
        <p>{service.serviceName}</p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <p>Principal</p>
        <p>{service.servicePrincipal}</p>
      </div>
      <div className="flex flex-row justify-between items-center w-full">
        <p>{t("subaccount")}</p>
        <p>{middleTruncation(service.subAccountId, 7, 5)}</p>
      </div>
    </div>
  );
}
