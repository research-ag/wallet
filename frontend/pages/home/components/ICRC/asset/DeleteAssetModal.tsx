// svg
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { BasicModal } from "@components/modal";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/button";
import { db } from "@/database/db";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { AssetMutationAction, setAssetMutation, setAssetMutationAction } from "@redux/assets/AssetReducer";
import { removeAssetFromServices } from "@redux/services/ServiceReducer";

const DeleteAssetModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { assetMutated, assetAction } = useAppSelector((state) => state.asset.mutation);
  const { contacts } = useAppSelector((state) => state.contacts);

  const isModalOpen = assetAction === AssetMutationAction.DELETE;

  return (
    <BasicModal
      width="w-[18rem]"
      padding="py-5"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={isModalOpen}
    >
      <div className="flex flex-col items-start justify-start w-full gap-4 text-md">
        <div className="flex flex-row items-center justify-between w-full px-8">
          <WarningIcon className="w-6 h-6" />
          <CloseIcon
            className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => dispatch(setAssetMutationAction(AssetMutationAction.NONE))}
          />
        </div>
        <div className="flex flex-col items-start justify-start w-full px-8">
          <p className="font-light text-left">
            {`${t("delete.asset.msg")}`}
            <span className="ml-1 font-semibold break-all">{assetMutated?.name}</span>?
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end w-full px-8 mt-4">
        <CustomButton className="min-w-[5rem]" onClick={handleConfirmButton} size={"small"}>
          <p>{t("confirm")}</p>
        </CustomButton>
      </div>
    </BasicModal>
  );

  async function handleConfirmButton() {
    if (!assetMutated) return;

    await db().deleteAsset(assetMutated?.address, { sync: true }).then();
    const updatedContacts = contacts.map((cntc) => {
      const updatedAssets = cntc.assets.filter((ast) => ast.tokenSymbol !== assetMutated?.tokenSymbol);
      return { ...cntc, assets: updatedAssets };
    });

    await db().updateContacts(updatedContacts, { sync: true }).then();

    dispatch(removeAssetFromServices(assetMutated.address));

    dispatch(setAssetMutationAction(AssetMutationAction.NONE));
    dispatch(setAssetMutation(undefined));
  }
};

export default DeleteAssetModal;
