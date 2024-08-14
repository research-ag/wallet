import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Contact, ContactAccount } from "@redux/models/ContactsModels";
import { CustomButton } from "@components/button";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import AssetSelect from "./AssetSelect";
import { CustomInput } from "@components/input";
import SubAccountInput from "./SubAccountInput";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { shortAddress } from "@common/utils/icrc";
import { CustomCopy } from "@components/tooltip";
import { LoadingLoader } from "@components/loader";
import logger from "@common/utils/logger";
import {
  isContactAccountNameValid,
  isContactSubaccountIdValid,
  isDuplicatedSubAccount,
} from "@pages/contacts/helpers/validators";
import contactAccountToAllowanceArgs from "@pages/contacts/helpers/mappers";
import { useAppSelector } from "@redux/Store";
import addAllowanceToSubaccounts from "@pages/contacts/helpers/addAllowanceToSubaccounts";
import { validatePrincipal } from "@common/utils/definityIdentity";
import getAccountFromPrincipal from "@pages/contacts/helpers/getAccountFromPrincipal";
import { db } from "@/database/db";
import AllowanceTooltip from "./AllowanceTooltip";
import { useTranslation } from "react-i18next";
import { removeExtraSpaces } from "@common/utils/strings";
import { ReactComponent as NoAllowanceIcon } from "@assets/svg/files/no-allowance.svg";

interface AddContactAccountRowProps {
  contact: Contact;
  setAddAccount: Dispatch<SetStateAction<boolean>>;
}

export interface ContactAccountError {
  name: boolean;
  subaccountId: boolean;
  tokenSymbol: boolean;
}

export default function AddContactAccountRow(props: AddContactAccountRowProps) {
  const { t } = useTranslation();
  const [isAllowanceLoading, setIsAllowanceLoading] = useState<boolean>(false);
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const [newAccount, setNewAccount] = useState<ContactAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHexadecimal, setIsHexadecimal] = useState<boolean>(true);
  const hasAllowance = newAccount?.allowance?.amount;
  const testRef = useRef<boolean>(false);

  const [errors, setErrors] = useState<ContactAccountError>({
    name: false,
    subaccountId: false,
    tokenSymbol: false,
  });

  return (
    <div className="h-[3rem] flex items-center">
      {newAccount ? (
        <div className="flex items-center w-full">
          <div className="w-[15.7%] pr-2">
            <AssetSelect onAssetChange={onAssetChange} error={errors.tokenSymbol} clearErrors={clearErrors} />
          </div>
          <div className="w-[21%] pr-6 flex items-center">
            <CustomInput
              intent={"primary"}
              placeholder={t("name.sub.account")}
              onChange={onAccountNameChange}
              className="h-[2.2rem] dark:bg-level-2-color bg-white rounded-lg border-[2px]"
              inputClass="h-[1.5rem]"
              border={errors.name ? "error" : "selected"}
              sizeComp={"xLarge"}
              sizeInput="small"
            />

            {testRef.current && !hasAllowance && (
              <div>
                <NoAllowanceIcon className="w-6 h-6 ml-1 dark:fill-no-allowance-icon fill-gray-color-5" />
              </div>
            )}

            {hasAllowance && (
              <AllowanceTooltip
                amount={newAccount.allowance?.amount || "0"}
                expiration={newAccount.allowance?.expiration || ""}
                tokenSymbol={newAccount.tokenSymbol}
              />
            )}
          </div>
          <div className=" w-[26.2%]">
            <SubAccountInput
              newAccount={newAccount}
              setNewAccount={setNewAccount}
              isHexadecimal={isHexadecimal}
              setIsHexadecimal={setIsHexadecimal}
              error={errors.subaccountId}
              clearErrors={clearErrors}
              setErrors={setErrors}
              ref={testRef}
            />
          </div>
          <div className=" w-[21.1%]">
            <div className="flex flex-row items-center w-full gap-2 px-2 opacity-70 text-nowrap">
              <p>{shortAddress(getSubAccount(props.contact.principal, newAccount.subaccountId), 7, 7)}</p>
              <CustomCopy
                size={"xSmall"}
                className="p-0"
                copyText={getSubAccount(props.contact.principal, newAccount.subaccountId)}
              />
            </div>
          </div>
          <div className=" w-[8%] flex justify-end">
            {isAllowanceLoading ? (
              <LoadingLoader />
            ) : (
              <CustomButton intent="success" size="small" onClick={onTestAccountAllowance}>
                <div className="flex p-0.5">
                  <MoneyHandIcon className="relative w-5 h-5 fill-PrimaryColorLight" />
                  <p className="ml-1 font-semibold text-md">{t("test")}</p>
                </div>
              </CustomButton>
            )}
          </div>
          <div className=" w-[8%]">
            <div className="flex items-center justify-center">
              {isLoading ? (
                <LoadingLoader />
              ) : (
                <CheckIcon
                  onClick={onSaveSubAccount}
                  className="w-6 h-6 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                />
              )}
              <CloseIcon
                onClick={onCancel}
                className="w-6 h-6 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
              />
            </div>
          </div>
        </div>
      ) : (
        <CustomButton
          size="small"
          onClick={() => {
            props.setAddAccount(true);
            setNewAccount({
              name: "",
              subaccount: "",
              subaccountId: "",
              tokenSymbol: "",
            });
          }}
          className="flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2 mb-0.5" />
          <p className="mt-0.5 font-bold text-md">{t("sub-acc")}</p>
        </CustomButton>
      )}
    </div>
  );

  function clearErrors() {
    setErrors({
      name: false,
      subaccountId: false,
      tokenSymbol: false,
    });
  }

  function onCancel() {
    props.setAddAccount(true);
    setIsAllowanceLoading(false);
    setIsLoading(false);
    setNewAccount(null);
    setErrors({
      name: false,
      subaccountId: false,
      tokenSymbol: false,
    });
    testRef.current = false;
  }

  function onAssetChange(tokenSymbol: string) {
    setNewAccount((prev) => {
      if (prev) return { ...prev, tokenSymbol };

      return {
        name: "",
        subaccount: "",
        subaccountId: "",
        tokenSymbol: tokenSymbol,
      };
    });
  }

  function onAccountNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErrors((prev) => ({ ...prev, name: false, subaccount: false, subaccountId: false, tokenSymbol: false }));

    setNewAccount((prev) => {
      if (prev) return { ...prev, name: removeExtraSpaces(event.target.value) };
      return {
        name: removeExtraSpaces(event.target.value),
        subaccount: "",
        subaccountId: "",
        tokenSymbol: "",
      };
    });
  }

  function getSubAccount(princ: string, subaccount?: string) {
    return encodeIcrcAccount({
      owner: Principal.fromText(princ || ""),
      subaccount: hexToUint8Array(subaccount || "0x0"),
    });
  }

  function isNewAccountValid(newAccount: ContactAccount): boolean {
    setErrors({ name: false, subaccountId: false, tokenSymbol: false });

    const errors: ContactAccountError = {
      name: false,
      subaccountId: false,
      tokenSymbol: false,
    };

    if (newAccount.tokenSymbol.length === 0) {
      errors.tokenSymbol = true;
    }

    if (!isContactAccountNameValid(newAccount.name)) {
      errors.name = true;
    }

    if (isHexadecimal) {
      if (!isContactSubaccountIdValid(newAccount.subaccountId)) {
        errors.subaccountId = true;
      }
    } else {
      if (!validatePrincipal(newAccount.subaccountId)) {
        errors.subaccountId = true;
      }
    }

    if (errors.name || errors.subaccountId || errors.tokenSymbol) {
      setErrors(errors);
      return false;
    }

    return true;
  }

  function isAccountDuplicated(newAccount: ContactAccount): boolean {
    if (isDuplicatedSubAccount(newAccount, props.contact.accounts)) {
      setErrors((prev) => ({ ...prev, subaccountId: true }));
      return true;
    }

    return false;
  }

  async function onTestAccountAllowance() {
    setIsAllowanceLoading(true);

    if (!newAccount) return;

    if (!isNewAccountValid(newAccount)) {
      setIsAllowanceLoading(false);
      return;
    }

    const toStoreAccount: ContactAccount = {
      ...newAccount,
      ...{
        subaccountId: isHexadecimal
          ? newAccount.subaccountId
          : getAccountFromPrincipal(newAccount.subaccountId).subAccountId,
        subaccount: isHexadecimal
          ? newAccount.subaccountId
          : getAccountFromPrincipal(newAccount.subaccountId).subaccount,
      },
    };

    if (isAccountDuplicated(toStoreAccount)) {
      setIsAllowanceLoading(false);
      return;
    }

    const allowanceArgs = contactAccountToAllowanceArgs({
      contactAccounts: [toStoreAccount],
      spenderPrincipal: userPrincipal.toString(),
      allocatorPrincipal: props.contact.principal,
    });

    const withAllowances = await addAllowanceToSubaccounts(allowanceArgs);

    setNewAccount((prev) => {
      if (prev)
        return {
          ...prev,
          ...withAllowances[0],
          subaccountId: newAccount.subaccountId,
          subaccount: newAccount.subaccountId,
        };

      return {
        name: "",
        subaccount: "",
        subaccountId: "",
        tokenSymbol: "",
        accounts: [],
      };
    });

    testRef.current = true;

    setIsAllowanceLoading(false);
  }

  async function onSaveSubAccount() {
    try {
      setIsLoading(true);

      // --- validate ---
      if (!newAccount) return;

      if (!isNewAccountValid(newAccount)) {
        setIsLoading(false);
        return;
      }

      const toStoreAccount: ContactAccount = {
        ...newAccount,
        ...{
          subaccountId: isHexadecimal
            ? newAccount.subaccountId
            : getAccountFromPrincipal(newAccount.subaccountId).subAccountId,
          subaccount: isHexadecimal
            ? newAccount.subaccountId
            : getAccountFromPrincipal(newAccount.subaccountId).subaccount,
        },
      };

      if (isAccountDuplicated(toStoreAccount)) {
        setIsLoading(false);
        return;
      }

      // --- add allowance ---

      const allowanceArgs = contactAccountToAllowanceArgs({
        contactAccounts: [toStoreAccount],
        spenderPrincipal: userPrincipal.toString(),
        allocatorPrincipal: props.contact.principal,
      });

      const withAllowances = await addAllowanceToSubaccounts(allowanceArgs);

      const updatedContact = {
        ...props.contact,
        accounts: [...props.contact.accounts, ...withAllowances],
      };

      // --- save contact ---

      await db().updateContact(props.contact.principal, updatedContact, { sync: true });
      setIsLoading(false);
      props.setAddAccount(true);

      setNewAccount(null);
    } catch (error) {
      logger.debug("onSaveSubAccount: error", error);
    } finally {
      setIsLoading(false);
      testRef.current = false;
    }
  }
}
