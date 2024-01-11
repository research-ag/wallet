import { Fragment } from "react";
import Menu from "@pages/components/Menu";
import ContactFilters from "./components/contactFilters";
import { useContacts } from "./hooks/contactsHook";
import ContactList from "./components/contactList";

const Contacts = () => {
  const { searchKey, setSearchKey, assetFilter, setAssetFilter } = useContacts();

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full pt-6 px-9">
        <Menu />
        <div className="flex flex-col items-start justify-start w-full h-full">
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
