import { ContactAccount } from "@redux/models/ContactsModels";
import { CustomButton } from "@components/button";
import { CustomInput } from "@components/input";
import { asciiHex } from "@pages/contacts/constants/asciiHex";
import { Dispatch, SetStateAction } from "react";
import { isContactSubaccountIdValid } from "@pages/contacts/helpers/validators";
import { ContactAccountError } from "./AddContactAccountRow";
import { validatePrincipal } from "@common/utils/definityIdentity";

interface SubAccountInputProps {
  newAccount: ContactAccount | null;
  setNewAccount: Dispatch<SetStateAction<ContactAccount | null>>;
  isHexadecimal: boolean;
  setIsHexadecimal: Dispatch<SetStateAction<boolean>>;
  error: boolean;
  setErrors: Dispatch<SetStateAction<ContactAccountError>>;
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
    props.setErrors((prev) => ({ ...prev, subAccountId: false }));
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
      if (isContactSubaccountIdValid(value)) {
        props.setErrors((prev) => ({ ...prev, subAccountId: true }));
      }
    } else {
      if (!validatePrincipal(value)) {
        props.setErrors((prev) => ({ ...prev, subAccountId: true }));
      }
    }
  }

  function onSubaccountTypeChange() {
    props.setIsHexadecimal((prev) => !prev);
  }
}
