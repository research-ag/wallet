// svg
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as SuccessIcon } from "@assets/svg/files/success.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { BasicModal } from "@components/modal";
import { Service, ServiceAsset } from "@redux/models/ServiceModels";
import { useTranslation } from "react-i18next";
import { toFullDecimal } from "@common/utils/amount";

interface NotifyAssetModalProps {
  open: boolean;
  setOpen(value: boolean): void;
  service: Service;
  asset: ServiceAsset;
  res: any;
}

export const NotifyAssetModal = (props: NotifyAssetModalProps) => {
  const { open, setOpen, service, asset, res } = props;
  const { t } = useTranslation();
  return (
    <BasicModal
      width="w-[18rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      background="dark:bg-secondary-color-2 bg-PrimaryColorLight"
      open={open}
    >
      <div className="flex flex-col items-start justify-start w-full gap-4 reative text-md">
        <CloseIcon
          className="absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
          onClick={onClose}
        />
        <div className="flex flex-row justify-start items-center gap-3">
          {res.Ok ? <SuccessIcon className="w-6 h-6" /> : <WarningIcon className="w-6 h-6" />}
          <p className=" text-lg font-semibold">
            {t(
              res.Ok
                ? "successful.notification"
                : res.Err.NotAvailable === "Deposit was not detected"
                ? "deposit.not.detected.title"
                : "fail.notification",
            )}
          </p>
        </div>
        <div className="flex flex-col justify-start items-start">
          <p className="font-semibold">{service.name}</p>
          {res.Ok ? (
            <>
              <p>
                {t("increased.balance")}:{" "}
                <span className="ml-1 font-semibold">
                  {toFullDecimal(res.Ok.deposit_inc, Number(asset.decimal || "8"), Number(asset.shortDecimal || "8"))}{" "}
                  {asset.tokenSymbol}
                </span>
              </p>
              <p>
                {t("increased.credit")}:{" "}
                <span className="ml-1 font-semibold">
                  {toFullDecimal(res.Ok.credit_inc, Number(asset.decimal || "8"), Number(asset.shortDecimal || "8"))}{" "}
                  {asset.tokenSymbol}
                </span>
              </p>
            </>
          ) : (
            <p>
              {t(res.Err.NotAvailable === "Deposit was not detected" ? "deposit.not.detected.msg" : "increased.error")}
            </p>
          )}
        </div>
      </div>
    </BasicModal>
  );
  function onClose() {
    setOpen(false);
  }
};
