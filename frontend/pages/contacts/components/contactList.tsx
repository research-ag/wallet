import { Fragment } from "react";
import { useContacts } from "../hooks/contactsHook";
import { useTranslation } from "react-i18next";
import { checkHexString } from "@/utils";
import { DeleteContactTypeEnum } from "@/const";
import RemoveModal from "./removeModal";
import TableContacts from "./tableContacts";

interface ContactListProps {
  searchKey: string;
  assetFilter: string[];
}

const ContactList = ({ searchKey, assetFilter }: ContactListProps) => {
  const { t } = useTranslation();
  const {
    subaccEdited,
    setSubaccEdited,
    deleteModal,
    setDeleteModal,
    deleteType,
    setDeleteType,
    deleteObject,
    setDeleteObject,
    subaccEditedErr,
    setSubaccEditedErr,
  } = useContacts();

  return (
    <Fragment>
      <div className="flex flex-col w-full h-full mt-3 scroll-y-light max-h-[calc(100vh-12rem)]">
        <TableContacts
          changeName={changeName}
          setDeleteType={setDeleteType}
          setDeleteObject={setDeleteObject}
          setSubaccEdited={setSubaccEdited}
          setSubaccEditedErr={setSubaccEditedErr}
          changeSubIdx={changeSubIdx}
          setDeleteModal={setDeleteModal}
          subaccEdited={subaccEdited}
          subaccEditedErr={subaccEditedErr}
          searchKey={searchKey}
          assetFilter={assetFilter}
        ></TableContacts>
      </div>
      <RemoveModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        deleteType={deleteType}
        getDeleteMsg={getDeleteMsg}
        deleteObject={deleteObject}
      />
    </Fragment>
  );
  function changeSubIdx(e: string) {
    if (checkHexString(e)) {
      setSubaccEdited((prev) => {
        return { ...prev, subaccount_index: e.trim() };
      });
      setSubaccEditedErr((prev) => {
        return {
          name: prev.name,
          subaccount_index: false,
        };
      });
    }
  }
  function changeName(e: string) {
    setSubaccEdited((prev) => {
      return { ...prev, name: e };
    });
    setSubaccEditedErr((prev) => {
      return {
        name: false,
        subaccount_index: prev.subaccount_index,
      };
    });
  }

  function getDeleteMsg() {
    let msg1 = "";
    let msg2 = "";

    switch (deleteType) {
      case DeleteContactTypeEnum.Enum.CONTACT:
        msg1 = t("delete.contact.contact.msg", { name: deleteObject.name });
        msg2 = deleteObject.name;
        break;
      case DeleteContactTypeEnum.Enum.ASSET:
        msg1 = t("delete.contact.asset.msg", { symbol: deleteObject.symbol });
        msg2 = deleteObject.symbol;
        break;
      case DeleteContactTypeEnum.Enum.SUB:
        msg1 = t("delete.contact.sub.msg", { name: deleteObject.subaccName });
        msg2 = deleteObject.subaccName;
        break;
      default:
        msg1 = t("delete.contact.contact.msg", { name: deleteObject.name });
        msg2 = deleteObject.name;
        break;
        break;
    }
    return { msg1: msg1, msg2: msg2 };
  }
};

export default ContactList;
