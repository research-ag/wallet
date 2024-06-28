import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { IconTypeEnum } from "@common/const";
import { getAssetIcon } from "@common/utils/icons";
import { shortAddress } from "@common/utils/icrc";
import { AvatarEmpty } from "@components/avatar";
import { CustomCopy } from "@components/tooltip";
import ContactAccountAction from "./ContactAccountAction";
import { Contact, ContactAccount } from "@redux/models/ContactsModels";
import { Asset } from "@redux/models/AccountModels";
import { encodeIcrcAccount } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { hexToUint8Array } from "@common/utils/hexadecimal";
import { Dispatch, SetStateAction } from "react";
import { CustomInput } from "@components/input";
import { isContactAccountNameValid } from "../../helpers/validators";
import { CheckIcon } from "@radix-ui/react-icons";
import logger from "@common/utils/logger";
import { db } from "@/database/db";
import AllowanceTooltip from "./AllowanceTooltip";
import { removeExtraSpaces } from "@common/utils/strings";

interface DisplayContactAccountRowProps {
  index: number;
  currentAccount: ContactAccount;
  currentAsset: Asset;
  contact: Contact;
  updateAccount: ContactAccount | null;
  setUpdateAccount: Dispatch<SetStateAction<ContactAccount | null>>;
  errors: { name: boolean };
  setErrors: Dispatch<SetStateAction<{ name: boolean }>>;
}

export default function DisplayContactAccountRow(props: DisplayContactAccountRowProps) {
  const isCurrentUpdate =
    props.updateAccount?.subaccountId === props.currentAccount.subaccountId &&
    props.updateAccount?.tokenSymbol === props.currentAccount.tokenSymbol;
  const hasAllowance = props.currentAccount.allowance?.amount;

  return (
    <tr key={props.index} className="h-[2.8rem]">
      <td className="h-full w-[5%]">
        <div className="relative flex items-center justify-center w-full h-full">
          <div className="w-1.5 h-1.5 bg-primary-color"></div>
          {props.index !== 0 && (
            <div className="absolute bottom-0 w-1 h-12 border-l border-dotted left-1/2 border-primary-color" />
          )}
        </div>
      </td>

      <td className="w-[15%]">
        <div className="flex items-center">
          {getAssetIcon(IconTypeEnum.Values.ASSET, props.currentAsset.tokenSymbol, props.currentAsset.logo)}
          <span className="ml-2">{props.currentAsset.symbol}</span>
        </div>
      </td>

      <td className="w-[20%]">
        {isCurrentUpdate ? (
          <div className="flex items-center gap-1 pr-1">
            <CustomInput
              placeholder="Subaccount name"
              onChange={onAccountNameChange}
              border={props.errors.name ? "error" : "selected"}
              value={props.updateAccount?.name || ""}
              className="h-[2.2rem] dark:bg-level-2-color bg-white rounded-lg border-[2px]"
              inputClass="h-[1.5rem] text-left text-md"
            />

            <CheckIcon
              onClick={onSaveNewName}
              className="w-6 h-6 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            />
            <CloseIcon
              onClick={onCancelUpdate}
              className="w-6 h-6 opacity-50 cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            />
          </div>
        ) : (
          <div className="flex items-center" onDoubleClick={onAccountNameUpdate}>
            <AvatarEmpty title={props.currentAccount.name} />
            <span className="mx-2">{props.currentAccount.name}</span>
            {hasAllowance && (
              <AllowanceTooltip
                amount={props.currentAccount.allowance?.amount || "0"}
                expiration={props.currentAccount.allowance?.expiration || ""}
                tokenSymbol={props.currentAccount.tokenSymbol}
              />
            )}
          </div>
        )}
      </td>

      <td className="w-[25%]">
        <div className="flex items-center">
          <p className="mr-2 text-nowrap">
            {props.currentAccount.subaccountId.length >= 20
              ? shortAddress(props.currentAccount.subaccountId, 10, 10)
              : props.currentAccount.subaccountId}
          </p>
          <CustomCopy size={"xSmall"} className="p-0" copyText={props.currentAccount.subaccountId} />
        </div>
      </td>

      <td className="w-[15%]">
        <div className="flex items-center w-full px-2">
          <p className="mr-2 text-nowrap">
            {shortAddress(getSubAccount(props.contact.principal, props.currentAccount.subaccountId), 7, 7)}
          </p>
          <CustomCopy
            size={"xSmall"}
            className="p-0"
            copyText={getSubAccount(props.contact.principal, props.currentAccount.subaccountId)}
          />
        </div>
      </td>

      <td className="w-[20%]">
        <ContactAccountAction account={props.currentAccount} contact={props.contact} />
      </td>
    </tr>
  );

  function onCancelUpdate() {
    props.setUpdateAccount(null);
    props.setErrors({ ...props.errors, name: false });
  }

  function getSubAccount(principal: string, subaccount?: string) {
    return encodeIcrcAccount({
      owner: Principal.fromText(principal),
      subaccount: hexToUint8Array(subaccount || "0x0"),
    });
  }

  function onAccountNameUpdate() {
    props.setUpdateAccount({ ...props.currentAccount });
  }

  function onAccountNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = removeExtraSpaces(event.target.value);
    props.setErrors({ ...props.errors, name: false });

    if (!isContactAccountNameValid(value)) {
      props.setErrors({ ...props.errors, name: true });
    }

    props.setUpdateAccount((prev) => {
      if (!prev)
        return {
          ...props.currentAccount,
          name: value,
        };

      return { ...prev, name: value };
    });
  }

  async function onSaveNewName() {
    try {
      props.setErrors({ ...props.errors, name: false });

      if (!isContactAccountNameValid(props.updateAccount?.name || "")) {
        props.setErrors({ ...props.errors, name: true });
        return;
      }

      const updatedContact = {
        ...props.contact,
        accounts: props.contact.accounts.map((acc) => {
          if (
            acc.subaccountId === props.updateAccount?.subaccountId &&
            acc.tokenSymbol === props.updateAccount?.tokenSymbol
          ) {
            return { ...acc, name: props.updateAccount?.name };
          }

          return acc;
        }),
      };

      await db().updateContact(props.contact.principal, updatedContact, { sync: true });
      props.setUpdateAccount(null);
    } catch (error) {
      logger.debug(error);
    }
  }
}
