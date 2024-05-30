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

interface DeleteServiceModalProps {
  open: boolean;
  setOpen(value: boolean): void;
  service: Service;
  removeService(srv: Service): void;
}

export const DeleteServiceModal = (props: DeleteServiceModalProps) => {
  const { open, setOpen, service, removeService } = props;
  const { t } = useTranslation();
  const [assets, setAssets] = useState<ServiceAsset[]>([]);
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

        {assets.length > 0 ? (
          <div className="flex flex-col items-start justify-start w-full gap-3">
            <p className="w-full break-words">
              <span className="ml-1 font-semibold">{service.name}</span> {t("currently.have")}:
            </p>
            {assets.map((ast, k) => {
              return (
                <p className="w-full break-words" key={k}>
                  <span className="ml-1 font-semibold">{ast.tokenSymbol}</span> {t("deposit")}{" "}
                  <span className="ml-1 font-semibold">
                    {toFullDecimal(ast.balance, Number(ast.decimal || "8"), Number(ast.shortDecimal || "8"))}
                  </span>{" "}
                  / {t("credit")}{" "}
                  <span className="ml-1 font-semibold">
                    {toFullDecimal(ast.credit, Number(ast.decimal || "8"), Number(ast.shortDecimal || "8"))}
                  </span>
                </p>
              );
            })}
            <p className="w-full py-3 border-t border-t-black/10 dark:border-t-white/10">
              {t("delete.service.confirmation")}
              <span className="ml-1 font-semibold">{service.name}</span>
              {t("service")}?
            </p>
          </div>
        ) : (
          <p className="w-full break-words">
            {t("delete.subacc.msg")}
            <span className="ml-1 font-semibold">{service.name}</span> {t("service")}?
          </p>
        )}

        <div className="flex flex-row items-start justify-end w-full ">
          <CustomButton
            className="min-w-[5rem]"
            onClick={assets.length > 0 ? onConfirmDelete : onDelete}
            size={"small"}
          >
            {isDeleteLoading ? <LoadingLoader /> : <p>{t(assets.length > 0 ? "confirm" : "yes")}</p>}
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

    const auxAssets = service.assets.filter((ast) => {
      return BigInt(ast.balance) > 0 || BigInt(ast.credit) > 0;
    });

    if (auxAssets.length > 0) setAssets(auxAssets);
    else {
      onConfirmDelete();
    }

    setDeleteLoading(false);
  }
  function onConfirmDelete() {
    setDeleteLoading(true);
    removeService(service);
    onClose();
    setDeleteLoading(false);
  }
};
