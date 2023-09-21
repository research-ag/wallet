import { Fragment } from "react";
import Menu from "@pages/components/Menu";
import ContactFilters from "./components/contactFilters";
import { useContacts } from "./hooks/contactsHook";
import ContactList from "./components/contactList";

const Contacts = () => {
  const { searchKey, setSearchKey, assetFilter, setAssetFilter } = useContacts();
  return (
    <Fragment>
      <div className="flex flex-col w-full h-full px-9 pt-6">
        <Menu />
        <div className="flex flex-col justify-start items-start w-full h-full">
          <ContactFilters
            searchKey={searchKey}
            assetFilter={assetFilter}
            setSearchKey={setSearchKey}
            setAssetFilter={setAssetFilter}
          />
          <ContactList searchKey={searchKey} assetFilter={assetFilter} />
        </div>
      </div>
    </Fragment>
  );
};

export default Contacts;
