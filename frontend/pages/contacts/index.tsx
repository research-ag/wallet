import Menu from "@pages/components/Menu";
import useContactFilters from "@pages/contacts/hooks/useContactFilters";
import ContactFilters from "@pages/contacts/components/contactFilters";
import { BasicModal } from "@components/modal";
import AddContact from "@pages/contacts/components/ICRC/AddContact";
import ContactList from "@pages/contacts/components/contactList";

const Contacts = () => {
  const { assetOpen, addOpen, searchKey, assetFilter, setAssetOpen, setAddOpen, setSearchKey, setAssetFilter } =
    useContactFilters();

  return (
    <div className="flex flex-col w-full pt-[1rem] px-[2rem]">
      <Menu />
      <div className="flex flex-col items-start justify-start w-full">
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
      <BasicModal
        open={addOpen}
        width="w-[48rem]"
        padding="py-5 px-8"
        border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      >
        <AddContact setAddOpen={setAddOpen} />
      </BasicModal>
    </div>
  );
};

export default Contacts;
