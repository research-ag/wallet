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
import { Contact } from "@redux/models/ContactsModels";
import { removeAssetFromServices } from "@redux/services/ServiceReducer";
import { toFullDecimal } from "@common/utils/amount";

const DeleteAssetModal = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { assetMutated, assetAction, extraData } = useAppSelector((state) => state.asset.mutation);
  const { contacts } = useAppSelector((state) => state.contacts);
  const { authClient } = useAppSelector((state) => state.auth);

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
        {extraData?.deletedServicesAssets && (
          <div className="flex flex-col justify-start items-start w-full px-8">
            <p className="font-light text-left">{t("delete.service.asset.msg")}:</p>
            {extraData?.deletedServicesAssets.map((ast: { name: string; credit: string; address: string }) => {
              return (
                <p key={ast.address}>{`• ${ast.name} ${
                  BigInt(ast.credit) > 0
                    ? `[${toFullDecimal(
                        ast.credit,
                        Number(assetMutated?.decimal || "8"),
                        Number(assetMutated?.shortDecimal || "8"),
                      )}} ${assetMutated?.symbol || ""}]`
                    : ""
                } `}</p>
              );
            })}
          </div>
        )}
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

    const updatedContacts = contacts.map((contact): Contact => {
      return {
        ...contact,
        accounts: contact.accounts.filter((account) => account.tokenSymbol !== assetMutated?.tokenSymbol),
      };
    });

    await db().updateContacts(updatedContacts, { sync: true }).then();

    dispatch(removeAssetFromServices({ authClient, addres: assetMutated.address }));

    dispatch(setAssetMutationAction(AssetMutationAction.NONE));
    dispatch(setAssetMutation(undefined));
  }
};

export default DeleteAssetModal;
