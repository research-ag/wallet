// svg
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { ReactComponent as SendUserIcon } from "@assets/svg/files/send-user-icon.svg";
//
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAppSelector } from "@redux/Store";
import { AvatarEmpty } from "@components/avatar";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { CustomInput } from "@components/input";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Contact } from "@redux/models/ContactsModels";
import { Principal } from "@dfinity/principal";
import { Buffer } from "buffer";

interface BeneficiaryContactBookProps {
  setSelectedContact(value: Contact | undefined): void;
}

export default function BeneficiaryContactBook(props: BeneficiaryContactBookProps) {
  const { setSelectedContact } = props;
  const { t } = useTranslation();
  const { setTransferState } = useTransfer();
  const { contacts } = useAppSelector((state) => state.contacts);
  const [searchKey, setSearchKey] = useState("");
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-0 m-0">
          <SendUserIcon className="cursor-pointer" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="absolute w-[21rem] max-h-[24vh] bg-secondary-color-1-light dark:bg-level-1-color border border-primary-color  z-[1000] -right-5  scroll-y-light rounded-lg  shadow-sm"
        >
          <div className="flex items-center justify-center w-full px-2 py-2">
            <CustomInput
              sizeComp={"medium"}
              sizeInput="medium"
              value={searchKey}
              onChange={onSearchChange}
              autoFocus
              placeholder={t("search")}
              prefix={<img src={SearchIcon} className="w-5 h-5 mx-2" alt="search-icon" />}
              compInClass="bg-white dark:bg-SecondaryColor"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {getContactOptions().map((contact, index) => {
            const { name } = contact;
            return (
              <DropdownMenu.Item
                className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-primary-color/50"
                key={`${contact.principal}-${index}`}
                onSelect={() => onSelectContact(contact)}
              >
                <div className="flex items-center justify-between mr-2">
                  <AvatarEmpty background={"info"} title={name} size="large" />
                  <div className="ml-2">
                    <p className="text-left text-md text-black-color dark:text-white">{name}</p>
                  </div>
                </div>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
  function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchKey(e.target.value);
  }
  function getContactOptions() {
    if (contacts?.length === 0) return [];
    const filteredContacts = contacts.filter((contact) => {
      const key = searchKey.trim().toLowerCase();
      const nameInclude = contact.name.toLowerCase().includes(key);
      return key === "" || nameInclude;
    });
    return filteredContacts;
  }

  function onSelectContact(contact: Contact) {
    const princBytes = Principal.fromText(contact.principal).toUint8Array();
    const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    setTransferState((prev) => ({
      ...prev,
      toSubAccount: princSubId,
    }));
    setSelectedContact(contact);
  }
}
