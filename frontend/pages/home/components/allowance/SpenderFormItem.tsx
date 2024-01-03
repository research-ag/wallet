import { Allowance, ErrorFields } from "@/@types/allowance";
import { ValidationErrors } from "@/@types/common";
import { SelectOption } from "@/@types/core";
import { AvatarEmpty } from "@components/avatar";
import { Input } from "@components/input";
import { Select } from "@components/select";
import { Switch } from "@components/switch";
import { Contact } from "@redux/models/ContactsModels";
import { useEffect, useMemo, useRef, useState } from "react";

interface ISpenderFormItemProps {
  contacts: Contact[];
  setAllowanceState: (allowanceData: Partial<Allowance>) => void;
  isLoading?: boolean;
  allowance: Allowance;
  isPrincipalValid: boolean;
  errors?: ValidationErrors[];
}

export default function SpenderFormItem(props: ISpenderFormItemProps) {
  const [isNew, setIsNew] = useState(false);
  const inputTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { contacts, setAllowanceState, isLoading, allowance, isPrincipalValid, errors } = props;
  const error = errors?.filter((error) => error.field === ErrorFields.spender)[0];

  const options = useMemo(() => {
    // TODO: add real id
    return contacts?.map((contact) => {
      return {
        value: contact.principal,
        label: contact.name,
        subLabel: "0xa...4bb",
        icon: <AvatarEmpty title={contact.name} size="medium" className="mr-4" />,
      };
    });
  }, [contacts]);

  const onContactBookChange = (checked: boolean) => setIsNew(checked);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = event.target.value;

    clearTimeout(inputTimeoutRef.current);

    inputTimeoutRef.current = setTimeout(() => {
      const spender = { principal: newSearchValue };
      setAllowanceState({ spender });
    }, 500);
  };

  const onSelectedChange = (option: SelectOption) => {
    const fullSpender = contacts.find((contact) => contact.principal === option.value);
    setAllowanceState({ spender: fullSpender });
  };

  useEffect(() => {
    if (isNew) {
      setAllowanceState({ spender: undefined });
    } else {
      setAllowanceState({ spender: contacts[0] });
    }
  }, [isNew]);

  return (
    <div className="mt-4">
      <label htmlFor="Spender" className="flex justify-between mb-2">
        <p className="text-lg">Spender</p>
        <div className=" w-3/6 bg-[#141231] rounded-md flex justify-between items-center px-2 py-1">
          <p className="text-md">Contact Book</p>
          <Switch checked={isNew} onChange={onContactBookChange} disabled={isLoading} />
          <p className="text-md">New</p>
        </div>
      </label>
      {!isNew && (
        <Select
          onSelect={onSelectedChange}
          options={options}
          disabled={isLoading}
          currentValue={allowance?.spender?.principal || ""}
          border={error || !isPrincipalValid ? "error" : undefined}
        />
      )}
      {isNew && (
        <Input
          placeholder="Principal"
          onChange={onInputChange}
          disabled={isLoading}
          border={error ? "error" : undefined}
        />
      )}
    </div>
  );
}
