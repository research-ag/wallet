// svg
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { useTranslation } from "react-i18next";
import ContactMainDetails from "./ContactMainDetails";
import { clsx } from "clsx";
import { LoadingLoader } from "@components/loader";
import { CustomButton } from "@components/button";
import ContactAssetDetails from "@/pages/contacts/components/ICRC/AddContact/ContactAssetDetails";
import { useCreateContact } from "@pages/contacts/hooks/useCreateContact";

interface AddContactProps {
  onClose(): void;
}

export default function AddContact({ onClose }: AddContactProps) {
  const { t } = useTranslation();

  const { newContact, onAddContact, onCheckAccountsAllowances, isAllowancesChecking, isCreating } = useCreateContact();

  // const isAssetICRC2Supported = false; TODO: if ICRC-2 is not supported what to do?
  const enableAllowanceTest = newContact.accounts.length > 0;

  return (
    <div className="relative flex flex-col items-start justify-start w-full gap-4 text-md">
      <CloseIcon className={getCloseIconStyles(isCreating)} onClick={onClose} />
      <p>{t("add.contact")}</p>

      <ContactMainDetails />
      <ContactAssetDetails />

      <div className="flex flex-row items-center justify-end w-full gap-3">
        <p className="text-TextErrorColor">
          {/* TODO: display error messages */}
          error
        </p>
        {(isAllowancesChecking || isCreating) && (
          <LoadingLoader color="dark:border-secondary-color-1-light border-black-color" />
        )}

        {enableAllowanceTest && (
          <CustomButton
            className="bg-slate-color-success min-w-[5rem] flex justify-between items-center"
            onClick={onCheckAccountsAllowances}
            disabled={isAllowancesChecking || isCreating}
          >
            <MoneyHandIcon className="fill-PrimaryColorLight" /> {t("test")}
          </CustomButton>
        )}

        {/* TODO: disable of error or loading */}
        <CustomButton className="min-w-[5rem]" onClick={onAddContact} disabled={isCreating || isAllowancesChecking}>
          <p>{t("add.contact")}</p>
        </CustomButton>
      </div>
    </div>
  );
}

function getCloseIconStyles(isCreating: boolean) {
  return clsx(
    "absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
    isCreating && "opacity-50 pointer-events-none",
  );
}
