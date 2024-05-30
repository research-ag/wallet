// svg
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { CustomButton } from "@components/button";
import { BasicModal } from "@components/modal";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { LoadingLoader } from "@components/loader";
import { Service, ServiceAsset } from "@redux/models/ServiceModels";
import { toFullDecimal } from "@common/utils/amount";

interface DeleteAssetServiceModalProps {
  open: boolean;
  setOpen(value: boolean): void;
  service: Service;
  asset: ServiceAsset;
  removeAssetService(servicePrinc: string, srv: ServiceAsset): void;
}

export const DeleteAssetServiceModal = (props: DeleteAssetServiceModalProps) => {
  const { open, setOpen, service, asset, removeAssetService } = props;
  const { t } = useTranslation();
  const [isDeleteLoading, setDeleteLoading] = useState(false);

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
          <WarningIcon className="w-6 h-6" />
          <p className=" text-lg font-semibold">{t("delete")}</p>
        </div>

        <div className="flex flex-col items-start justify-start w-full gap-3">
          <p className="w-full break-words">
            <span className="ml-1 font-semibold">{service.name}</span> {t("currently.have")}:
          </p>
          <p className="w-full break-words">
            <span className="ml-1 font-semibold">{asset.tokenSymbol}</span> {t("deposit")}{" "}
            <span className="ml-1 font-semibold">
              {toFullDecimal(asset.balance, Number(asset.decimal || "8"), Number(asset.shortDecimal || "8"))}
            </span>{" "}
            / {t("credit")}{" "}
            <span className="ml-1 font-semibold">
              {toFullDecimal(asset.credit, Number(asset.decimal || "8"), Number(asset.shortDecimal || "8"))}
            </span>
          </p>
          <p className="w-full py-3 border-t border-t-black/10 dark:border-t-white/10">
            {t("delete.service.confirmation")}
            <span className="ml-1 font-semibold">{asset.tokenSymbol}</span>?
          </p>
        </div>

        <div className="flex flex-row items-start justify-end w-full ">
          <CustomButton className="min-w-[5rem]" onClick={onDelete} size={"small"}>
            {isDeleteLoading ? <LoadingLoader /> : <p>{t("yes")}</p>}
          </CustomButton>
        </div>
      </div>
    </BasicModal>
  );
  function onClose() {
    setOpen(false);
  }
  function onDelete() {
    setDeleteLoading(true);
    removeAssetService(service.principal, asset);
    onClose();
    setDeleteLoading(false);
  }
};
