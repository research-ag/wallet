import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { Contact, ContactAccount } from "@redux/models/ContactsModels";
import { useAppSelector } from "@redux/Store";
import logger from "@common/utils/logger";
import AddContactAccountRow from "./AddContactAccountRow";
import DisplayContactAccountRow from "./DisplayContactAccountRow";
import { useState } from "react";
import { useTranslation } from "react-i18next";

enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

enum SortField {
  ASSET = "tokenSymbol",
  SUBACCOUNTNAME = "name",
}

export default function SubAccountTable({ contact }: { contact: Contact }) {
  const { t } = useTranslation();
  const assets = useAppSelector((state) => state.asset.list.assets);

  const [errors, setErrors] = useState({ name: false });
  const [updateAccount, setUpdateAccount] = useState<ContactAccount | null>(null);

  const [sortField, setSortField] = useState<SortField>(SortField.ASSET);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [addAccount, setAddAccount] = useState(false);

  return (
    <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
      <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
        <table className="w-full text-left">
          <thead className="h-[2.8rem]">
            <tr>
              <th className="w-[5%]"></th>
              <th className="w-[15%]">
                <span className="flex items-center">
                  <p className="text-md">{t("asset")}</p>
                  <SortIcon
                    className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                    onClick={onAssetSortClick}
                  />
                </span>
              </th>
              <th className="w-[20%]">
                <span className="flex items-center">
                  <p>{t("name.sub.account")}</p>
                  <SortIcon
                    className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                    onClick={onSubAccountNameSortClick}
                  />
                </span>
              </th>
              <th className="w-[25%]">{t("sub-acc")}</th>
              <th className="w-[15%] pl-3">{t("account.indentifier")}</th>
              <th className="w-[20%]"></th>
            </tr>
          </thead>
          <tbody>
            {getSortedAccounts(contact.accounts, sortField, sortOrder).map((currentAccount, index) => {
              const currentAsset = assets.find((asset) => asset.tokenSymbol === currentAccount.tokenSymbol);

              if (!currentAsset) {
                logger.debug("SubAccountTable: required asset not found ", currentAccount.tokenSymbol);
                return null;
              }

              return (
                <DisplayContactAccountRow
                  key={`${contact.principal}-${currentAccount.subaccountId}-${index}`}
                  contact={contact}
                  currentAccount={currentAccount}
                  currentAsset={currentAsset}
                  index={index}
                  setUpdateAccount={setUpdateAccount}
                  updateAccount={updateAccount}
                  errors={errors}
                  setErrors={setErrors}
                />
              );
            })}
            <tr className={getAddRowStyle(addAccount)}>
              <td colSpan={1}></td>
              <td colSpan={5}>
                <AddContactAccountRow contact={contact} setAddAccount={setAddAccount} />
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );

  function getSortedAccounts(accounts: ContactAccount[], sortField: SortField, sortOrder: SortOrder) {
    return [...accounts].sort((a, b) => {
      const sortValueA = sortField === SortField.ASSET ? a.tokenSymbol.toLowerCase() : a.name.toLowerCase();
      const sortValueB = sortField === SortField.ASSET ? b.tokenSymbol.toLowerCase() : b.name.toLowerCase();

      const compared = sortValueA.localeCompare(sortValueB);
      return sortOrder === SortOrder.ASC ? compared : -compared;
    });
  }

  function onAssetSortClick() {
    setSortField(SortField.ASSET);
    setSortOrder(sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
  }

  function onSubAccountNameSortClick() {
    setSortField(SortField.SUBACCOUNTNAME);
    setSortOrder(sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
  }
}

const getAddRowStyle = (addAccount: boolean) => {
  return addAccount ? "bg-primary-color/30" : "";
};
