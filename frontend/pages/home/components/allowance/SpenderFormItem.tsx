import { Allowance } from "@/@types/allowance";
import { SelectOption } from "@/@types/core";
import { AvatarEmpty } from "@components/core/avatar";
import { Input } from "@components/core/input";
import { Select } from "@components/core/select";
import { Switch } from "@components/core/switch";
import { Contact } from "@redux/models/ContactsModels";
import { useEffect, useMemo, useRef, useState } from "react";

interface ISpenderFormItemProps {
  contacts: Contact[];
  setAllowanceState: (allowanceData: Partial<Allowance>) => void;
  isLoading?: boolean;
  allowance: Allowance;
}

export default function SpenderFormItem(props: ISpenderFormItemProps) {
  const [checked, setChecked] = useState(false);
  const inputTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { contacts, setAllowanceState, isLoading, allowance } = props;

  const options = useMemo(() => {
    return contacts?.map((contact) => {
      return {
        value: contact.principal,
        label: contact.name,
        subLabel: "0xa...4bb",
        icon: <AvatarEmpty title={contact.name} size="medium" className="mr-4" />,
      };
    });
  }, [contacts]);

  const onContactBookChange = (checked: boolean) => setChecked(checked);

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
    if (!checked) {
      setAllowanceState({ spender: undefined });
    } else {
      setAllowanceState({ spender: contacts[0] });
    }
  }, [checked]);

  return (
    <div className="mt-4">
      <label htmlFor="Spender" className="flex justify-between mb-2">
        <p className="text-lg">Spender</p>
        <div className=" w-3/6 bg-[#141231] rounded-md flex justify-between items-center px-2 py-1">
          <p className="text-md">Contact Book</p>
          <Switch checked={checked} onChange={onContactBookChange} disabled={isLoading} />
          <p className="text-md">New</p>
        </div>
      </label>
      {checked && (
        <Select
          onSelect={onSelectedChange}
          options={options}
          disabled={isLoading}
          currentValue={allowance?.spender?.principal || ""}
        />
      )}
      {!checked && <Input placeholder="Principal" onChange={onInputChange} disabled={isLoading} />}
    </div>
  );
}
