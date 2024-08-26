import { BasicSelect } from "@components/select";
import { useState } from "react";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { useAppSelector } from "@redux/Store";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { Contact } from "@redux/models/ContactsModels";
import { useTranslation } from "react-i18next";
import { shortAddress } from "@common/utils/icrc";

interface ReceiverContactBeneficiarySelectorProps {
  selectedContact?: Contact;
  setSelectedContact(value: Contact | undefined): void;
  setBeneficiary(value: string): void;
  fromAllowances?: boolean;
  onSelectOption(option: SelectOption): void;
}

export default function ReceiverContactBeneficiarySelector(props: ReceiverContactBeneficiarySelectorProps) {
  const { selectedContact, setSelectedContact, setBeneficiary, fromAllowances, onSelectOption } = props;
  const { t } = useTranslation();
  const { authClient } = useAppSelector((state) => state.auth);
  const { setTransferState } = useTransfer();
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { contacts } = useAppSelector((state) => state.contacts);

  const formattedContacts = (() => {
    const selfOption: SelectOption = {
      value: authClient,
      label: t("self"),
      subLabel: `${shortAddress(authClient, 12, 10)}`,
      icon: <AvatarEmpty title={t("self")} background={"info"} size="medium" className="mr-4" userIcon />,
      labelClassname: "font-semibold",
    };

    if (!searchSubAccountValue) return [selfOption, ...contacts.map(formatContact)];
    const res = contacts
      .filter((contact) => {
        return (
          (!selectedContact || selectedContact.principal !== contact.principal) &&
          (contact.name.toLocaleLowerCase().includes(searchSubAccountValue.trim()) || searchSubAccountValue === "")
        );
      })
      .map(formatContact);

    return [selfOption, ...res];
  })();

  return (
    <div className="relative w-full">
      <BasicSelect
        onSelect={onSelect}
        options={formattedContacts}
        initialValue={`${selectedContact?.principal}`}
        currentValue={`${selectedContact?.principal}`}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth={fromAllowances ? "22rem" : "21rem"}
        margin="!mt-0"
      />
      <button
        className={`absolute ${fromAllowances ? "right-6 top-1" : "-right-4 -bottom-[2.75rem]"}`}
        onClick={onClear}
      >
        <p className="text-md text-slate-color-info underline">{t("clear")}</p>
      </button>
    </div>
  );

  function formatContact(contact: Contact): SelectOption {
    return {
      value: `${contact.principal}`,
      label: `${contact.name}`,
      subLabel: `${shortAddress(contact.principal, 12, 10)}`,
      icon: <AvatarEmpty title={contact.name} background={"info"} className="mr-4" size="medium" />,
    };
  }

  function onSelect(option: SelectOption) {
    setSearchSubAccountValue(null);
    onSelectOption(option);
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }

  function onClear() {
    setTransferState((prev) => ({
      ...prev,
      toSubAccount: "err",
    }));
    setSelectedContact(undefined);
    setBeneficiary("");
  }
}
