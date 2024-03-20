import Menu from "@pages/components/Menu";
import useContactFilters from "./hooks/useContactFilters";
import ContactFilters from "./components/contactFilters";
import {Modal} from "@components/modal";
import AddContact from "./components/ICRC/AddContact";
import ContactList from "./components/contactList";

const Contacts = () => {
  const { assetOpen, addOpen, searchKey, assetFilter, setAssetOpen, setAddOpen, setSearchKey, setAssetFilter } =
    useContactFilters();

  return (
    <div className="flex flex-col w-full h-full pt-6 px-9">
      <Menu />
      <div className="flex flex-col items-start justify-start w-full h-full">
        <ContactFilters
          assetOpen={assetOpen}
          addOpen={addOpen}
          searchKey={searchKey}
          assetFilter={assetFilter}
          setAssetOpen={setAssetOpen}
          setAddOpen={setAddOpen}
          setSearchKey={setSearchKey}
          setAssetFilter={setAssetFilter}
        />
        <ContactList searchKey={searchKey} assetFilter={assetFilter} />
      </div>
      <Modal
        open={addOpen}
        width="w-[48rem]"
        padding="py-5 px-8"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      >
        <AddContact setAddOpen={setAddOpen} />
      </Modal>
    </div>
  );
};

export default Contacts;
