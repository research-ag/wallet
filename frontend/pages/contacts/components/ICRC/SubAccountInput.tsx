import { ContactAccount } from "@/@types/contacts";
import { CustomButton } from "@components/button";
import { CustomInput } from "@components/input";
import { asciiHex } from "@pages/contacts/constants/asciiHex";
import { Dispatch, SetStateAction } from "react";

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
        border={props.error ? "error" : undefined}
        sizeComp={"xLarge"}
        sizeInput="small"
        inputClass="text-center"
        value={props.newAccount?.subaccountId}
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
      // if (subaccEdited.subaccount_index.includes("0x") || subaccEdited.subaccount_index.includes("0X")) {
      //   if (e.key === "X" || e.key == "x") {
      //     e.preventDefault();
      //   }
      // }
    }
  }

  function onSubAccountChange(e: React.ChangeEvent<HTMLInputElement>) {
    // TODO: validate depending on isHexadecimal
    props.clearErrors();
    const value = e.target.value;

    props.setNewAccount((prev) => {
      if (prev) return { ...prev, subaccountId: value };

      return {
        name: "",
        subaccount: "",
        subaccountId: value,
        tokenSymbol: "",
      };
    });

    if (props.isHexadecimal) {
      // TODO: validate if hexadecimal is valid
    } else {
      // TODO: validate if principal is valid
    }
  }

  function onSubaccountTypeChange() {
    props.setIsHexadecimal((prev) => !prev);
  }
}
