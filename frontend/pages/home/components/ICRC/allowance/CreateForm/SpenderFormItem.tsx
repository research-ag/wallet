import { AllowanceErrorFieldsEnum, TAllowance } from "@/@types/allowance";
import { TErrorValidation } from "@/@types/common";
import { SelectOption } from "@/@types/components";
import { middleTruncation } from "@/utils/strings";
import { AvatarEmpty } from "@components/avatar";
import { Input } from "@components/input";
import { Select } from "@components/select";
import { Switch } from "@components/switch";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { Contact } from "@redux/models/ContactsModels";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface ISpenderFormItemProps {
  contacts: Contact[];
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
  isLoading?: boolean;
  allowance: TAllowance;
  isPrincipalValid: boolean;
  errors?: TErrorValidation[];
}

export default function SpenderFormItem(props: ISpenderFormItemProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const inputTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const onSearchChange = (searchValue: string) => setSearch(searchValue);
  const onOpenChange = () => setSearch(null);

  const { contacts, setAllowanceState, isLoading, allowance, isPrincipalValid, errors } = props;
  const error = errors?.filter((error) => error.field === AllowanceErrorFieldsEnum.Values.spender)[0];

  const options = useMemo(() => {
    if (!search) contacts?.map(formatContact);
    return contacts
      ?.filter((contact) => contact.name.toLowerCase().includes(search?.toLowerCase() || ""))
      .map(formatContact);
  }, [search, contacts]);

  useEffect(() => {
    if (isNew) {
      setAllowanceState({ spender: undefined });
    }
  }, [isNew]);

  return (
    <div className="mt-4">
      <label htmlFor="Spender" className="flex justify-between mb-2">
        <p className="text-lg">{t("spender")}</p>
        <div className="flex items-center justify-between w-3/6 px-2 py-1 rounded-md bg-PrimaryColorLight dark:bg-ThemeColorBack">
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("contact.book")}</p>
          <Switch checked={isNew} onChange={onContactBookChange} disabled={isLoading} />
          <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("new")}</p>
        </div>
      </label>
      {!isNew && (
        <Select
          onSelect={onSelectedChange}
          options={options}
          disabled={isLoading}
          currentValue={allowance?.spender?.principal || ""}
          border={error || !isPrincipalValid ? "error" : undefined}
          onSearch={onSearchChange}
          onOpenChange={onOpenChange}
        />
      )}
      {isNew && (
        <Input
          placeholder="Principal"
          onChange={onInputChange}
          disabled={isLoading}
          border={error || !isPrincipalValid ? "error" : undefined}
        />
      )}
    </div>
  );

  function formatContact(contact: Contact) {
    return {
      value: contact.principal,
      label: contact.name,
      subLabel: middleTruncation(contact.principal, 3, 3),
      icon: <AvatarEmpty title={contact.name} size="medium" className="mr-4" />,
    };
  }

  function onContactBookChange(checked: boolean) {
    setIsNew(checked);
    setAllowanceState({ spender: initialAllowanceState.spender });
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = event.target.value;
    clearTimeout(inputTimeoutRef.current);

    inputTimeoutRef.current = setTimeout(() => {
      const spender = { principal: newSearchValue, name: "" };
      setAllowanceState({ spender });
    }, 500);
  }

  function onSelectedChange(option: SelectOption) {
    setSearch(null);
    const fullSpender = contacts.find((contact) => contact.principal === option.value);
    setAllowanceState({ spender: fullSpender });
  }
}
