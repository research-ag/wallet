import Menu from "@pages/components/Menu";
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { useCallback, useState } from "react";
import AssetFilter from "./components/ICRC/AssetFilter";
import { useTranslation } from "react-i18next";
import { CustomInput } from "@components/input";
import AddContactModal from "./components/ICRC/AddContactModal";
import ContactList from "./components/ContactList";
import Switch from "@components/switch/BasicSwitch";

const Contacts = () => {
  const { t } = useTranslation();
  const [allowanceOnly, setAllowanceOnly] = useState(false);
  const [contactSearchKey, setContactSearchKey] = useState("");
  const [assetFilter, setAssetFilter] = useState<string[]>([]);

  const onContactSearchKeyChange = useCallback((searchKey: string) => {
    setContactSearchKey(searchKey);
  }, []);

  const onAssetFilterChange = useCallback((assetFilter: string[]) => {
    setAssetFilter(assetFilter);
  }, []);

  return (
    <div className="flex flex-col w-full pt-[1rem] px-[2.25rem]">
      <Menu />
      <div className="flex flex-col items-start justify-start w-full gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-10/12 gap-3 text-md">
            <AssetFilter assetFilter={assetFilter} onAssetFilterChange={onAssetFilterChange} />

            <CustomInput
              compOutClass="!w-[40%]"
              prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
              intent={"secondary"}
              sizeInput={"medium"}
              placeholder={t("search.contact")}
              value={contactSearchKey}
              onChange={(e) => onContactSearchKeyChange(e.target.value)}
            />

            <AddContactModal />
          </div>
          <div className="flex items-center justify-end w-2/12">
            <p className="mr-2 place-self-end text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {t("allowances.only")}
            </p>
            <Switch checked={allowanceOnly} onChange={() => setAllowanceOnly(!allowanceOnly)} />
          </div>
        </div>
        <ContactList contactSearchKey={contactSearchKey} assetFilter={assetFilter} allowanceOnly={allowanceOnly} />
      </div>
    </div>
  );
};

export default Contacts;
