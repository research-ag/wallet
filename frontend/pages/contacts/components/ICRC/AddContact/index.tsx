// svg
import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { useCreateContact } from "@pages/contacts/hooks/useCreateContact";
import { useTranslation } from "react-i18next";
import ContactMainDetails from "./ContactMainDetails";
import { clsx } from "clsx";
import { useState } from "react";
import { LoadingLoader } from "@components/loader";
import { CustomButton } from "@components/button";
import { validatePrincipal } from "@common/utils/definityIdentity";
import logger from "@common/utils/logger";
import useContactErrorMesage from "@pages/contacts/hooks/useContactErrorMessage";
import ContactAssetDetails from "@/pages/contacts/components/ICRC/AddContact/ContactAssetDetails";
import { checkHexString } from "@common/utils/hexadecimal";
import { useAppSelector } from "@redux/Store";

interface AddContactProps {
  onClose(): void;
}
export default function AddContact({ onClose }: AddContactProps) {
  const { t } = useTranslation();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const errorMessage = useContactErrorMesage();
  const [isAllowancesChecking, setIsAllowancesChecking] = useState<boolean>(false);
  const { newContactErrors, setNewContactErrors, isCreating, newContact, setNewContact } = useCreateContact();

  // const isAssetICRC2Supported = (() => {
  //   const fullAsset = assets.find((asset) => asset.tokenSymbol === selAstContact);
  //   return fullAsset?.supportedStandards?.includes(SupportedStandardEnum.Values["ICRC-2"]);
  // })();

  // const isAssetICRC2Supported = false;
  // TODO: is one is beign added (missing id) do not allow to test (show warning???)
  // TODO: if ICRC-2 is not supported what to do?
  const enableAllowanceTest = newContact.accounts.length > 0;

  return (
    <div className="relative flex flex-col items-start justify-start w-full gap-4 text-md">
      <CloseIcon className={getCloseIconStyles(isCreating)} onClick={onClose} />
      <p>{t("add.contact")}</p>

      <ContactMainDetails
        newContact={newContact}
        setNewContact={setNewContact}
        newContactErrors={newContactErrors}
        setNewContactErrors={setNewContactErrors}
      />

      <ContactAssetDetails setNewContact={setNewContact} newContact={newContact} />

      <div className="flex flex-row items-center justify-end w-full gap-3">
        <p className="text-TextErrorColor">{errorMessage}</p>
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

        <CustomButton className="min-w-[5rem]" onClick={console.log} disabled={isCreating || isAllowancesChecking}>
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

      const requestArgs = contactAccounts.map((account) => {
        const currentAsset = assets.find((asset) => asset.tokenSymbol === account.tokenSymbol);

        if (!currentAsset) {
          logger.debug("onAllowanceNewContactCheck: Asset not found", account.tokenSymbol);
          return;
        }

        return {
          assetAddress: currentAsset?.address,
          assetDecimal: currentAsset?.decimal,
          spenderSubaccount: account.subaccountId,
          spenderPrincipal: newContact.principal,
        };
      });

      console.log(requestArgs);

      // allocator principal
      // allocator subaccount
      // spender principal
      // asset ledger
      // asset decimal

      // TODO: for each requestArgs call retrieveSubAccountsWithAllowance parallelly

      // for (let index = 0; index < newSubAccounts.length; index++) {
      // const subAccount = newSubAccounts[index];

      // const isSubAccountDuplicated =
      //   newSubAccounts.filter((currentSubAccount) => subAccount.subaccountId === currentSubAccount.subaccountId)
      //     .length > 1;

      // if (subAccount.name.trim().length === 0) {
      //   setNewContactSubNameErr([index]);
      //   return;
      // }

      // if (!isHexadecimalValid(subAccount.subaccountId) || isSubAccountDuplicated) {
      //   setNewContactSubIdErr([index]);
      //   return;
      // }
      // }

      // setNewContactSubNameErr([]);
      // setNewContactSubIdErr([]);

      // const findAssetResult = assets.find((asset) => asset.tokenSymbol === selAstContact);
      // if (!findAssetResult) {
      //   logger.debug("onAllowanceNewContactCheck: Asset not found", selAstContact);
      //   return;
      // }

      // const fullSubAccounts = await retrieveSubAccountsWithAllowance({
      //   accountPrincipal: newContact.principal,
      //   subAccounts: newSubAccounts,
      //   assetAddress: findAssetResult.address,
      //   assetDecimal: findAssetResult.decimal,
      // });

      // setNewSubaccounts(fullSubAccounts);
    } catch (error) {
      logger.debug(error);
    } finally {
      setIsAllowancesChecking(false);
    }
  }

  // function onAddContact() {
  //   let validContact = true;
  //   let err = { msg: "", name: false, prin: false };

  //   if (newContact.name.trim() === "" && newContact.principal.trim() === "") {
  //     validContact = false;
  //     err = { msg: "check.add.contact.both.err", name: true, prin: true };
  //   } else {
  //     if (newContact.name.trim() === "") {
  //       validContact = false;
  //       err = { ...err, msg: "check.add.contact.name.err", name: true };
  //     }
  //     if (newContact.principal.trim() === "") {
  //       validContact = false;
  //       err = { ...err, msg: "check.add.contact.prin.empty.err", prin: true };
  //     } else if (!checkPrincipalValid(newContact.principal)) {
  //       validContact = false;
  //       err = { ...err, msg: "check.add.contact.prin.err", prin: true };
  //     }
  //   }
  //   setNewContactErr(err.msg);
  //   setNewContactNameErr(err.name);
  //   setNewContactPrinErr(err.prin);
  //   isValidSubacc("add", validContact);
  // }
}

function getCloseIconStyles(isCreating: boolean) {
  return clsx(
    "absolute cursor-pointer top-5 right-5 stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor",
    isCreating && "opacity-50 pointer-events-none",
  );
}
