import { useTranslation } from "react-i18next";
import { NewContactSubAccount, SubAccountContact, SubAccountContactErr } from "@redux/models/ContactsModels";
import { DeleteContactTypeEnum } from "@/const";
import TableContactRows from "./TableContactRows";

interface TableContactsProps {
  changeName(value: string): void;
  setDeleteType(value: DeleteContactTypeEnum): void;
  setDeleteObject(value: NewContactSubAccount): void;
  setSubaccEdited(value: SubAccountContact): void;
  setSubaccEditedErr(value: SubAccountContactErr): void;
  changeSubIdx(value: string): void;
  setDeleteModal(value: boolean): void;
  subaccEdited: SubAccountContact;
  subaccEditedErr: SubAccountContactErr;
  searchKey: string;
  assetFilter: string[];
}

const TableContacts = (props: TableContactsProps) => {
  const { t } = useTranslation();

  return (
    <table className="w-full text-PrimaryTextColorLight dark:text-PrimaryTextColor text-md">
      <thead className="sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo text-PrimaryTextColor/70 z-[1]">
        <tr className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">
          <th className="p-2 text-left w-[30%] bg-PrimaryColorLight dark:bg-PrimaryColor ">
            <p>{t("name")}</p>
          </th>
          <th className="p-2 text-left w-[40%] bg-PrimaryColorLight dark:bg-PrimaryColor">
            <p>{"Principal"}</p>
          </th>
          <th className="p-2 w-[15%] bg-PrimaryColorLight dark:bg-PrimaryColor">
            <p>{t("assets")}</p>
          </th>
          <th className="p-2 w-[12%] bg-PrimaryColorLight dark:bg-PrimaryColor">
            <p>{t("action")}</p>
          </th>
          <th className="w-[3%] bg-PrimaryColorLight dark:bg-PrimaryColor"></th>
        </tr>
      </thead>
      <TableContactRows {...props} />
    </table>
  );
};

export default TableContacts;
