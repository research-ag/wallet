import { ReactComponent as MoneyHandIcon } from "@assets/svg/files/money-hand.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { Contact, ContactAccount } from "@/@types/contacts";
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

interface AddContactAccountRowProps {
  contact: Contact;
}

interface ContactAccountError {
  name: boolean;
  subaccount: boolean;
  subaccountId: boolean;
  tokenSymbol: boolean;
  message: string;
}

export default function AddContactAccountRow(props: AddContactAccountRowProps) {
  const [newAccount, setNewAccount] = useState<ContactAccount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<ContactAccountError>({
    name: false,
    subaccount: false,
    subaccountId: false,
    tokenSymbol: false,
    message: "",
  });

  return (
    <div className="h-[3rem] flex items-center">
      {newAccount ? (
        <div className="flex items-center w-full">
          <div className="w-[15.7%]">
            <AssetSelect onAssetChange={onAssetChange} />
          </div>
          <div className="w-[21%] pr-4">
            <CustomInput placeholder="Subaccount name" onChange={onAccountNameChange} className="h-[2.2rem]" />
          </div>
          <div className=" w-[21.2%]">
            <SubAccountInput newAccount={newAccount} setNewAccount={setNewAccount} />
          </div>
          <div className=" w-[26.1%]">
            <div className="flex flex-row items-center w-full gap-2 px-2 opacity-70">
              <p>{shortAddress(getSubAccount(props.contact.principal, newAccount.subaccountId), 14, 14)}</p>
              <CustomCopy
                size={"xSmall"}
                className="p-0"
                copyText={getSubAccount(props.contact.principal, newAccount.subaccountId)}
              />
            </div>
          </div>
          <div className=" w-[8%] flex justify-end">
            <CustomButton intent="success" size="small">
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
    setNewAccount((prev) => {
      if (prev) return { ...prev, name: e.target.value };

      // TODO: validate name

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
      subaccount: hexToUint8Array(`0x${subaccount}` || "0x0"),
    });
  }

  function onSaveSubAccount() {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Save subaccount", newAccount);
      setIsLoading(false);
      setNewAccount(null);
    }, 1000);
  }
}
