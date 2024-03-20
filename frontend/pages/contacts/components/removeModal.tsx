// svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import Modal from "@components/Modal";
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
import { DeleteContactTypeEnum } from "@/const";
import useContactTable from "../hooks/useContactTable";

interface RemoveModalProps {
  deleteModal: boolean;
  setDeleteModal(value: boolean): void;
  deleteType: DeleteContactTypeEnum;
  getDeleteMsg(): { msg1: string; msg2: string };
  deleteObject: {
    principal: string;
    name: string;
    tokenSymbol: string;
    symbol: string;
    subaccIdx: string;
    subaccName: string;
    totalAssets: number;
    TotalSub: number;
  };
}

const RemoveModal = ({ deleteModal, setDeleteModal, deleteType, getDeleteMsg, deleteObject }: RemoveModalProps) => {
  const { t } = useTranslation();
  const { removeCntct, removeAsset, removeSubacc } = useContactTable();

  return (
    <Modal
      open={deleteModal}
      width="w-[18rem]"
      padding="py-5"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
    >
      <div className="flex flex-col items-start justify-start w-full gap-4 text-md">
        <div className="flex flex-row items-center justify-between w-full px-8">
          <WarningIcon className="w-6 h-6" />
          <CloseIcon
            className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => {
              setDeleteModal(false);
            }}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full px-8">
          <p className="font-light text-left">
            {getDeleteMsg().msg1}
            <span className="ml-1 font-semibold break-all">{getDeleteMsg().msg2}</span>?
          </p>
        </div>
        {(deleteType === DeleteContactTypeEnum.Enum.CONTACT || deleteType === DeleteContactTypeEnum.Enum.ASSET) && (
          <div className="flex flex-row items-start justify-start w-full gap-1 px-8 py-3 bg-SecondaryColorLight dark:bg-SecondaryColor">
            <div className="flex flex-col items-start justify-start">
              {deleteType === DeleteContactTypeEnum.Enum.CONTACT && <p>{t("total.assets")}</p>}
              <p>{t("total.subacc")}</p>
            </div>
            <div className="flex flex-col items-start justify-start">
              {deleteType === DeleteContactTypeEnum.Enum.CONTACT && (
                <p className="font-semibold">{deleteObject.totalAssets}</p>
              )}
              <p className="font-semibold">{deleteObject.TotalSub}</p>
            </div>
          </div>
        )}
        <div className="flex flex-row items-center justify-end w-full px-8">
          <CustomButton className="min-w-[5rem]" onClick={handleConfirmButton} size={"small"}>
            <p>{t("confirm")}</p>
          </CustomButton>
        </div>
      </div>
    </Modal>
  );

  function handleConfirmButton() {
    switch (deleteType) {
      case DeleteContactTypeEnum.Enum.CONTACT:
        removeCntct(deleteObject.principal);
        break;
      case DeleteContactTypeEnum.Enum.ASSET:
        removeAsset(deleteObject.principal, deleteObject.tokenSymbol);
        break;
      case DeleteContactTypeEnum.Enum.SUB:
        removeSubacc(deleteObject.principal, deleteObject.tokenSymbol, deleteObject.subaccIdx);
        break;
      default:
        break;
    }
    setDeleteModal(false);
  }
};

export default RemoveModal;
