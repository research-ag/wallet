import { BasicModal } from "@components/modal";
import { useState } from "react"; // svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
import logger from "@common/utils/logger";
import { LoadingLoader } from "@components/loader";
import { Contact, ContactAccount } from "@/@types/contacts";

export default function DeleteContactAccountModal({ contact, account }: { contact: Contact; account: ContactAccount }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <CustomButton className="p-0" onClick={() => setOpen(true)} size={"small"} intent="error">
        <p>Delete</p>
      </CustomButton>

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
              Are you sure you want to delete <span className="font-semibold">{account.name}</span> from {contact.name}?
            </p>
          </div>

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

  async function handleConfirmButton() {
    try {
      setLoading(true);
      // TODO: update contact removing the account
      console.log("Deleting contact account", account);
    } catch (error) {
      logger.debug(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
}
