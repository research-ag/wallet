// svg
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { useTranslation } from "react-i18next";
import ContactMainDetails from "./ContactMainDetails";
import { clsx } from "clsx";
import { useState } from "react";
import { LoadingLoader } from "@components/loader";
import { CustomButton } from "@components/button";
import { validatePrincipal } from "@common/utils/definityIdentity";
import logger from "@common/utils/logger";
import ContactAssetDetails from "@/pages/contacts/components/ICRC/AddContact/ContactAssetDetails";
import { checkHexString } from "@common/utils/hexadecimal";
import { useAppSelector } from "@redux/Store";
import addAllowanceToSubaccounts, { RequestAccountAllowance } from "@pages/contacts/helpers/addAllowanceToSubaccounts";
import {
  isContactAccountNameValid,
  isContactAccountValid,
  isContactNameValid,
  isContactPrincipalValid,
} from "@pages/contacts/helpers/validators";
import { useContactError } from "@pages/contacts/contexts/ContactErrorProvider";
import { useContact } from "@pages/contacts/contexts/ContactProvider";
// import { useContactError } from "@pages/contacts/contexts/ContactErrorProvider";

interface AddContactProps {
  onClose(): void;
}
export default function AddContact({ onClose }: AddContactProps) {
  const { t } = useTranslation();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const [isAllowancesChecking, setIsAllowancesChecking] = useState<boolean>(false);
  const { newContact, setNewContact } = useContact();
  const [isCreating, setIsCreating] = useState(false);
  const { setNewContactErrors } = useContactError();

  // const isAssetICRC2Supported = false;
  // TODO: is one is beign added (missing id) do not allow to test (show warning???)
  // TODO: if ICRC-2 is not supported what to do?
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
            onClick={onAllowanceNewContactCheck}
            disabled={isAllowancesChecking || isCreating}
          >
            <MoneyHandIcon className="fill-PrimaryColorLight" /> {t("test")}
          </CustomButton>
        )}

        <CustomButton className="min-w-[5rem]" onClick={onAddContact} disabled={isCreating || isAllowancesChecking}>
          <p>{t("add.contact")}</p>
        </CustomButton>
      </div>
    </div>
  );

  async function onAllowanceNewContactCheck() {
    try {
      setIsAllowancesChecking(true);
      const isPrincipalValid = validatePrincipal(newContact.principal);
      if (!isPrincipalValid) setNewContactErrors((prev) => ({ ...prev, principal: true }));
      else setNewContactErrors((prev) => ({ ...prev, principal: false }));

      const contactAccounts = newContact.accounts.filter((account) => {
        return account.subaccountId.trim().length > 0 && checkHexString(account.subaccountId);
      });

      const requestArgs: (RequestAccountAllowance | undefined)[] = contactAccounts.map((account) => {
        const currentAsset = assets.find((asset) => asset.tokenSymbol === account.tokenSymbol);

        if (!currentAsset) {
          logger.debug("onAllowanceNewContactCheck: Asset not found", account.tokenSymbol);
          return;
        }

        return {
          assetAddress: currentAsset?.address,
          assetDecimal: currentAsset?.decimal,
          spenderPrincipal: newContact.principal,
          allocatorPrincipal: userPrincipal.toString(),
          allocatorSubaccount: account.subaccountId,
          account,
        };
      });

      const subaccounts = requestArgs.filter((item) => Boolean(item)) as RequestAccountAllowance[];
      const newSubAccounts = await addAllowanceToSubaccounts(subaccounts);

      // TODO: if no name set but id empty, it will be removed.
      // TODO: if (no name) or (no name and no id) explit and include after test
      setNewContact((prev) => ({ ...prev, accounts: newSubAccounts }));
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsAllowancesChecking(false);
    }
  }

  function onAddContact() {
    setIsCreating(true);
    if (!isContactNameValid(newContact.name)) console.log("invalid contact name");
    if (!isContactPrincipalValid(newContact.principal)) console.log("invalid contact principal");

    const subAccountErrors = newContact.accounts.map((account, index) => {
      if (isContactAccountValid(account)) return null;
      return {
        index,
        name: !isContactAccountNameValid(account.name),
        subAccountId: !checkHexString(account.subaccountId),
        tokenSymbol: false,
      };
    });

    const accountErrors = subAccountErrors.filter((error) => error !== null);

    if (accountErrors.length > 0) {
      console.log("invalid subaccount");
    }

    // TODO: save contact action
    setIsCreating(false);
  }
}

function getCloseIconStyles(isCreating: boolean) {
  return clsx(
    "absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
    isCreating && "opacity-50 pointer-events-none",
  );
}
