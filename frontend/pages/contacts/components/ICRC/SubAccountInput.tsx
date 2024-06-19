import { ContactAccount } from "@redux/models/ContactsModels";
import { CustomInput } from "@components/input";
import { asciiHex } from "@pages/contacts/constants/asciiHex";
import { Dispatch, SetStateAction } from "react";
import { getSubAccount, getSubAccountId } from "@pages/contacts/helpers/formatters";
import { ContactAccountError } from "./AddContactAccountRow";
import { validatePrincipal } from "@common/utils/definityIdentity";
import Switch from "@components/switch/BasicSwitch";

interface SubAccountInputProps {
  newAccount: ContactAccount | null;
  setNewAccount: Dispatch<SetStateAction<ContactAccount | null>>;
  isHexadecimal: boolean;
  setIsHexadecimal: Dispatch<SetStateAction<boolean>>;
  error: boolean;
  clearErrors: () => void;
  setErrors: Dispatch<SetStateAction<ContactAccountError>>;
}

export default function SubAccountInput(props: SubAccountInputProps) {
  return (
    <div className="relative flex flex-row items-center w-full h-10 gap-1 pr-2">
      <CustomInput
        intent={"primary"}
        border={props.error ? "error" : "selected"}
        sizeComp={"xLarge"}
        sizeInput="small"
        value={props.newAccount?.subaccount}
        onChange={onSubAccountChange}
        onKeyDown={onKeyDownIndex}
        className="h-[2.2rem] dark:bg-level-2-color bg-white rounded-lg border-[2px]"
        inputClass="h-[1.5rem]"
        placeholder={props.isHexadecimal ? "Hexadecimal" : "Principal"}
      />

      <div className="flex items-center ml-1 mr-[1rem]">
        <p className="mr-2 text-md">{props.isHexadecimal ? "Hex" : "Principal"}</p>
        <Switch checked={props.isHexadecimal} size="medium" onChange={() => {
          props.setIsHexadecimal((prev) => (!prev))
          props.setErrors((prev) => ({
            ...prev,
            subaccountId: false,
          }))
          props.setNewAccount((prev) => {

            if (!prev) return {
              name: "",
              subaccount: "",
              subaccountId: "",
              tokenSymbol: "",
            };

            return { ...prev, subaccountId: "", subaccount: "" };
          })
        }} />
      </div>
    </div>
  );

  function onKeyDownIndex(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!props.isHexadecimal) {
      if (!asciiHex.includes(e.key)) {
        e.preventDefault();
      }
      if (props.newAccount?.subaccountId?.toLowerCase().startsWith("0x")) {
        if (e.key?.toLowerCase() === "x") {
          e.preventDefault();
        }
      }
    }
  }

  function onSubAccountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    props.setNewAccount((prev) => {
      if (prev)
        return {
          ...prev,
          subaccount: props.isHexadecimal ? getSubAccount(value) : value,
          subaccountId: props.isHexadecimal ? getSubAccountId(value) : value,
        };

      return {
        name: "",
        subaccount: "",
        subaccountId: "",
        tokenSymbol: "",
      };
    });

    if (!props.isHexadecimal) {
      props.setErrors((prev) => ({
        ...prev,
        subaccountId: !validatePrincipal(value),
      }));
    }
  }

}
