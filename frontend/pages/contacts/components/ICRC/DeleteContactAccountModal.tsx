import { BasicModal } from "@components/modal";
import { useState } from "react"; // svgs
import { ReactComponent as WarningIcon } from "@assets/svg/files/warning.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { CustomButton } from "@components/button";
import { useTranslation } from "react-i18next";
import logger from "@common/utils/logger";
import { LoadingLoader } from "@components/loader";
import { Contact, ContactAccount } from "@redux/models/ContactsModels";
import { db } from "@/database/db";
import { TrashIcon } from "@radix-ui/react-icons";

export default function DeleteContactAccountModal({ contact, account }: { contact: Contact; account: ContactAccount }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <CustomButton className="flex items-center p-0" onClick={() => setOpen(true)} size={"small"} intent="error">
        <TrashIcon className="w-5 h-5 mr-[0.2]" />
        <p className="text-md">{t("delete")}</p>
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

      const updatedContact = {
        ...contact,
        accounts: contact.accounts.filter(
          (acc) => !(acc.subaccountId === account.subaccountId && acc.tokenSymbol === account.tokenSymbol),
        ),
      };

      await db().updateContact(contact.principal, updatedContact, { sync: true });
    } catch (error) {
      logger.debug(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
}
