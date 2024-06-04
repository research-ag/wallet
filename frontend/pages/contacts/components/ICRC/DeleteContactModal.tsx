import { ReactComponent as TrashIcon } from "@assets/svg/files/trash-icon.svg";
import { BasicModal } from "@components/modal";
import { useState } from "react"; // svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
// import deleteContact from "@pages/contacts/services/deleteContact";
import logger from "@common/utils/logger";
import { LoadingLoader } from "@components/loader";
import { Contact } from "@/@types/contacts";

export default function DeleteContactModal({ contact }: { contact: Contact }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  console.log(contact);
  // TODO: complete new contact type
  // let ttlSub = 0;
  // contact.assets.map((asst) => {
  //   ttlSub = ttlSub + asst.subaccounts.length;
  // });

  // const deleteObject = {
  //   principal: contact.principal,
  //   name: contact.name,
  //   tokenSymbol: "",
  //   symbol: "",
  //   subaccIdx: "",
  //   subaccName: "",
  //   totalAssets: contact.assets.length,
  //   TotalSub: ttlSub,
  // };

  return (
    <>
      <TrashIcon
        onClick={() => setOpen(true)}
        className="w-4 h-4 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor"
      />

      <BasicModal
        open={open}
        width="w-[18rem]"
        padding="py-5"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      >
        <div className="flex flex-col items-start justify-start w-full gap-4 text-md">
          <div className="flex flex-row items-center justify-between w-full px-8">
            <WarningIcon className="w-6 h-6" />
            <CloseIcon
              className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="flex flex-col items-start justify-start w-full px-8">
            <p className="font-light text-left">
              {/* {getDeleteMessage().msg1} */}
              {/* <span className="ml-1 font-semibold break-all">{getDeleteMessage().msg2}</span>? */}
            </p>
          </div>

          <div className="flex flex-row items-start justify-start w-full gap-1 px-8 py-3 bg-SecondaryColorLight dark:bg-SecondaryColor">
            <div className="flex flex-col items-start justify-start">
              <p>{t("total.assets")}</p>
              <p>{t("total.subacc")}</p>
            </div>
            <div className="flex flex-col items-start justify-start">
              {/* <p className="font-semibold">{deleteObject.totalAssets}</p>
              <p className="font-semibold">{deleteObject.TotalSub}</p> */}
            </div>
          </div>

          {/* {(deleteType === DeleteContactTypeEnum.Enum.CONTACT || deleteType === DeleteContactTypeEnum.Enum.ASSET) && (
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
          )} */}

          <div className="flex flex-row items-center justify-end w-full px-8">
            {isLoading && <LoadingLoader className="mr-2" />}
            <CustomButton className="min-w-[5rem]" onClick={handleConfirmButton} size={"small"}>
              <p>{t("confirm")}</p>
            </CustomButton>
          </div>
        </div>
      </BasicModal>
    </>
  );

  // function getDeleteMessage() {
  // return {
  //   msg1: t("delete.contact.contact.msg", { name: deleteObject.name }),
  //   msg2: deleteObject.name,
  // };
  // }

  // function getDeleteMs() {
  //   let msg1 = "";
  //   let msg2 = "";

  //   switch (deleteType) {
  //     case DeleteContactTypeEnum.Enum.CONTACT:
  //       msg1 = t("delete.contact.contact.msg", { name: deleteObject.name });
  //       msg2 = deleteObject.name;
  //       break;
  //     case DeleteContactTypeEnum.Enum.ASSET:
  //       msg1 = t("delete.contact.asset.msg", { symbol: deleteObject.symbol });
  //       msg2 = deleteObject.symbol;
  //       break;
  //     case DeleteContactTypeEnum.Enum.SUB:
  //       msg1 = t("delete.contact.sub.msg", { name: deleteObject.subaccName });
  //       msg2 = deleteObject.subaccName;
  //       break;
  //     default:
  //       msg1 = t("delete.contact.contact.msg", { name: deleteObject.name });
  //       msg2 = deleteObject.name;
  //       break;
  //   }

  //   return { msg1: msg1, msg2: msg2 };
  // }

  async function handleConfirmButton() {
    try {
      setLoading(true);
      // await deleteContact(deleteObject.principal);
    } catch (error) {
      logger.debug(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
    // switch (deleteType) {
    //   case DeleteContactTypeEnum.Enum.CONTACT:
    //     removecontactt(deleteObject.principal);
    //     break;
    //   case DeleteContactTypeEnum.Enum.ASSET:
    //     removeAsset(deleteObject.principal, deleteObject.tokenSymbol);
    //     break;
    //   case DeleteContactTypeEnum.Enum.SUB:
    //     removeSubacc(deleteObject.principal, deleteObject.tokenSymbol, deleteObject.subaccIdx);
    //     break;
    //   default:
    //     break;
    // }
  }

  // function onDeleteSubAccount(contact: Contact) {
  //   setAddSub(false);
  //   setSelContactPrin("");
  //   setSelSubaccIdx("");
  //   setDeleteType(DeleteContactTypeEnum.Enum.CONTACT);
  //   let ttlSub = 0;
  //   contact.assets.map((asst) => {
  //     ttlSub = ttlSub + asst.subaccounts.length;
  //   });
  //   setDeleteObject({
  //     principal: contact.principal,
  //     name: contact.name,
  //     tokenSymbol: "",
  //     symbol: "",
  //     subaccIdx: "",
  //     subaccName: "",
  //     totalAssets: contact.assets.length,
  //     TotalSub: ttlSub,
  //   });
  //   setDeleteModal(true);
  // }
}
