import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Contact, ContactAccount } from "@redux/models/ContactsModels";
import { CustomButton } from "@components/button";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
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

interface AddContactAccountRowProps {
  contact: Contact;
}

export interface ContactAccountError {
  name: boolean;
  subaccountId: boolean;
  tokenSymbol: boolean;
}

export default function AddContactAccountRow(props: AddContactAccountRowProps) {
  const userPrincipal = useAppSelector((state) => state.auth.userPrincipal);
  const [newAccount, setNewAccount] = useState<ContactAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHexadecimal, setIsHexadecimal] = useState<boolean>(true);
  const hasAllowance = newAccount?.allowance?.amount;

  const [errors, setErrors] = useState<ContactAccountError>({
    name: false,
    subaccountId: false,
    tokenSymbol: false,
  });

  return (
    <div className="h-[3rem] flex items-center">
      {newAccount ? (
        <div className="flex items-center w-full">
          <div className="w-[15.7%]">
            <AssetSelect onAssetChange={onAssetChange} error={errors.tokenSymbol} clearErrors={clearErrors} />
          </div>
          <div className="w-[21%] pr-4 flex items-center">
            <CustomInput
              placeholder="Subaccount name"
              onChange={onAccountNameChange}
              className="h-[2.2rem] "
              border={errors.name ? "error" : undefined}
            />

            {hasAllowance && (
              <AllowanceTooltip
                amount={newAccount.allowance?.amount || "0"}
                expiration={newAccount.allowance?.expiration || ""}
                tokenSymbol={newAccount.tokenSymbol}
              />
            )}
          </div>
          <div className=" w-[21.2%]">
            <SubAccountInput
              newAccount={newAccount}
              setNewAccount={setNewAccount}
              isHexadecimal={isHexadecimal}
              setIsHexadecimal={setIsHexadecimal}
              error={errors.subaccountId}
              clearErrors={clearErrors}
            />
          </div>
          <div className=" w-[26.1%]">
            <div className="flex flex-row items-center w-full gap-2 px-2 opacity-70">
              <p>{shortAddress(getSubAccount(props.contact.principal, newAccount.subaccountId), 10, 10)}</p>
              <CustomCopy
                size={"xSmall"}
                className="p-0"
                copyText={getSubAccount(props.contact.principal, newAccount.subaccountId)}
              />
            </div>
          </div>
          <div className=" w-[8%] flex justify-end">
            <CustomButton intent="success" size="small" onClick={onTestAccountAllowance}>
              <div className="flex p-0.5">
                <MoneyHandIcon className="relative w-5 h-5 fill-PrimaryColorLight" />
                <p className="ml-1 font-semibold text-md">Test</p>
              </div>
            </CustomButton>
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
                onClick={() => setNewAccount(null)}
                className="w-6 h-6 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
              />
            </div>
          </div>
        </div>
      ) : (
        <CustomButton
          size="small"
          onClick={() =>
            setNewAccount({
              name: "",
              subaccount: "",
              subaccountId: "",
              tokenSymbol: "",
            })
          }
          className="flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2 mb-0.5" />
          <p className="mt-0.5 font-bold text-md">Sub-account</p>
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

  function onAccountNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors((prev) => ({ ...prev, name: false, subaccount: false, subaccountId: false, tokenSymbol: false }));

    setNewAccount((prev) => {
      if (prev) return { ...prev, name: e.target.value };
      return {
        name: e.target.value,
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

    if (newAccount.tokenSymbol.length === 0) {
      setErrors((prev) => ({ ...prev, tokenSymbol: true }));
      return false;
    }

    if (!isContactAccountNameValid(newAccount.name)) {
      setErrors((prev) => ({ ...prev, name: true }));
      return false;
    }

    if (isHexadecimal) {
      if (!isContactSubaccountIdValid(newAccount.subaccountId)) {
        setErrors((prev) => ({ ...prev, subaccountId: true }));
        return false;
      }
    } else {
      if (!validatePrincipal(newAccount.subaccountId)) {
        setErrors((prev) => ({ ...prev, subaccountId: true }));
        return false;
      }
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

    const allowanceArgs = contactAccountToAllowanceArgs({
      contactAccounts: [toStoreAccount],
      spenderPrincipal: props.contact.principal,
      allocatorPrincipal: userPrincipal.toString(),
    });

    const withAllowances = await addAllowanceToSubaccounts(allowanceArgs);
    // TODO: do not include the variable "accounts" returned from the function

    setNewAccount((prev) => {
      if (prev) return { ...prev, ...withAllowances[0] };

      return {
        name: "",
        subaccount: "",
        subaccountId: "",
        tokenSymbol: "",
        accounts: [],
      };
    });
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
        spenderPrincipal: props.contact.principal,
        allocatorPrincipal: userPrincipal.toString(),
      });

      const withAllowances = await addAllowanceToSubaccounts(allowanceArgs);

      const updatedContact = {
        ...props.contact,
        accounts: [...props.contact.accounts, ...withAllowances],
      };

      // --- save contact ---

      await db().updateContact(props.contact.principal, updatedContact, { sync: true });
      setIsLoading(false);

      setNewAccount(null);
    } catch (error) {
      logger.debug("onSaveSubAccount: error", error);
    } finally {
      setIsLoading(false);
    }
  }
}
