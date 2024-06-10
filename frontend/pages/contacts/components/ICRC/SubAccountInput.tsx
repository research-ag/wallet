import { ContactAccount } from "@redux/models/ContactsModels";
import { CustomButton } from "@components/button";
import { CustomInput } from "@components/input";
import { asciiHex } from "@pages/contacts/constants/asciiHex";
import { Dispatch, SetStateAction } from "react";
import { getSubAccount, getSubAccountId } from "@pages/contacts/helpers/formatters";

interface SubAccountInputProps {
  newAccount: ContactAccount | null;
  setNewAccount: Dispatch<SetStateAction<ContactAccount | null>>;
  isHexadecimal: boolean;
  setIsHexadecimal: Dispatch<SetStateAction<boolean>>;
  error: boolean;
  clearErrors: () => void;
}

export default function SubAccountInput(props: SubAccountInputProps) {
  return (
    <div className="relative flex flex-row items-center w-full h-10 gap-1 pr-2">
      <CustomInput
        intent={"primary"}
        border={props.error ? "error" : "selected"}
        sizeComp={"xLarge"}
        sizeInput="small"
        inputClass="text-center"
        value={props.newAccount?.subaccount}
        onChange={onSubAccountChange}
        onKeyDown={onKeyDownIndex}
      />
      <CustomButton size={"xSmall"} onClick={onSubaccountTypeChange}>
        <p className="text-sm">{props.isHexadecimal ? "Principal" : "Hex"}</p>
      </CustomButton>
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
  }

  function onSubaccountTypeChange() {
    props.setIsHexadecimal((prev) => !prev);
    props.clearErrors();
  }
}
