import {
  AssetContact,
  Contact,
  NewContactSubAccount,
  SubAccountContact,
  SubAccountContactErr,
} from "@redux/models/ContactsModels";
import { DeleteContactTypeEnum } from "@/const";
import SubAccountBody from "./SubAccountBody";
import SubAccountHeader from "./subAccountHeader";

interface TableSubAccountsProps {
  asst: AssetContact;
  addSub: boolean;
  selSubaccIdx: string;
  subaccEdited: SubAccountContact;
  subaccEditedErr: SubAccountContactErr;
  cntc: Contact;
  setSubaccEdited(value: SubAccountContact): void;
  changeSubIdx(value: string): void;
  changeName(value: string): void;
  setAddSub(value: boolean): void;
  setSelSubaccIdx(value: string): void;
  setSelContactPrin(value: string): void;
  setDeleteModal(value: boolean): void;
  setDeleteType(value: DeleteContactTypeEnum): void;
  setSubaccEditedErr(value: SubAccountContactErr): void;
  setDeleteObject(value: NewContactSubAccount): void;
}

const TableSubAccounts = ({
  asst,
  addSub,
  selSubaccIdx,
  subaccEdited,
  subaccEditedErr,
  cntc,
  setSubaccEdited,
  changeSubIdx,
  changeName,
  setAddSub,
  setSelSubaccIdx,
  setSelContactPrin,
  setDeleteModal,
  setDeleteType,
  setSubaccEditedErr,
  setDeleteObject,
}: TableSubAccountsProps) => {
  return (
    <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md ">
      <SubAccountHeader asst={asst} addSub={addSub} />
      <SubAccountBody
        asst={asst}
        addSub={addSub}
        selSubaccIdx={selSubaccIdx}
        subaccEdited={subaccEdited}
        subaccEditedErr={subaccEditedErr}
        cntc={cntc}
        setSubaccEdited={setSubaccEdited}
        changeSubIdx={changeSubIdx}
        changeName={changeName}
        setAddSub={setAddSub}
        setSelSubaccIdx={setSelSubaccIdx}
        setSelContactPrin={setSelContactPrin}
        setDeleteModal={setDeleteModal}
        setDeleteType={setDeleteType}
        setSubaccEditedErr={setSubaccEditedErr}
        setDeleteObject={setDeleteObject}
      />
    </table>
  );
};

export default TableSubAccounts;
