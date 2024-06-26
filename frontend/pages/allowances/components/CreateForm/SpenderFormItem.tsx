import { AllowanceValidationErrorsEnum, TAllowance } from "@/@types/allowance";
import { SelectOption } from "@/@types/components";
import formatContact from "@/common/utils/formatContact";
import { validatePrincipal } from "@/common/utils/definityIdentity";
import { BasicInput } from "@components/input";
import { BasicSelect } from "@components/select";
import { BasicSwitch } from "@components/switch";
import { useAppSelector } from "@redux/Store";
import { removeAllowanceErrorAction } from "@redux/allowance/AllowanceActions";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Contact } from "@redux/models/ContactsModels";

interface ISpenderFormItemProps {
  contacts: Contact[];
  setAllowanceState: (allowanceData: Partial<TAllowance>) => void;
  isLoading?: boolean;
  allowance: TAllowance;
}

export default function SpenderFormItem(props: ISpenderFormItemProps) {
  const { t } = useTranslation();
  const [isPrincipalValid, setIsPrincipalValid] = useState(true);
  const { errors } = useAppSelector((state) => state.allowance);
  const [search, setSearch] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const inputTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const onSearchChange = (searchValue: string) => setSearch(searchValue);
  const onOpenChange = () => setSearch(null);

  const { contacts, setAllowanceState, isLoading, allowance } = props;

  const options = useMemo(() => {
    if (!search) return contacts?.map(formatContact);

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
    <div className="mx-auto mt-4 w-[22rem]">
      <label htmlFor="Spender" className="flex items-center justify-between mb-2">
        <p className="text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("spender")}</p>
        <div className="flex items-center justify-between px-2 py-1 rounded-md dark:bg-ThemeColorBack">
          <p className="mr-1 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("contact.book")}</p>
          <BasicSwitch checked={isNew} onChange={onContactBookChange} disabled={isLoading} />
          <p className="ml-1 text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("new")}</p>
        </div>
      </label>
      {!isNew && (
        <BasicSelect
          onSelect={onSelectedChange}
          options={options}
          disabled={isLoading}
          currentValue={allowance?.spender || ""}
          border={getError() ? "error" : undefined}
          onSearch={onSearchChange}
          onOpenChange={onOpenChange}
          componentWidth="22rem"
        />
      )}
      {isNew && (
        <BasicInput
          placeholder="Principal"
          onChange={onInputChange}
          disabled={isLoading}
          border={getError() || !isPrincipalValid ? "error" : undefined}
        />
      )}
    </div>
  );

  function onContactBookChange(checked: boolean) {
    setIsNew(checked);
    setAllowanceState({ spender: initialAllowanceState.spender });
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = event.target.value.trim();

    if (!validatePrincipal(newSearchValue)) {
      setIsPrincipalValid(false);
    } else {
      setIsPrincipalValid(true);
      removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"]);
    }

    clearTimeout(inputTimeoutRef.current);

    inputTimeoutRef.current = setTimeout(() => {
      setAllowanceState({ spender: newSearchValue });
    }, 500);
  }

  function onSelectedChange(option: SelectOption) {
    setSearch(null);
    const fullSpender = contacts.find((contact) => contact.principal === option.value);
    setAllowanceState({ spender: fullSpender?.principal || "" });
  }

  function getError(): boolean {
    return errors?.includes(AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"]) || false;
  }
}
