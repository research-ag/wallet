import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { Contact, ContactAccount } from "@redux/models/ContactsModels";
import { useAppSelector } from "@redux/Store";
import logger from "@common/utils/logger";
import AddContactAccountRow from "./AddContactAccountRow";
import DisplayContactAccountRow from "../DisplayContactAccountRow";
import { useState } from "react";

export default function SubAccountTable({ contact }: { contact: Contact }) {
  // const { t } = useTranslation();
  const assets = useAppSelector((state) => state.asset.list.assets);
  const [errors, setErrors] = useState({ name: false });
  const [updateAccount, setUpdateAccount] = useState<ContactAccount | null>(null);

  return (
    <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
      <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
        <table className="w-full text-left">
          <thead className="h-[2.8rem]">
            <tr>
              <th className="w-[5%]"></th>
              <th className="w-[15%]">
                <span className="flex items-center">
                  <p className="text-md">Asset</p>
                  <SortIcon
                    className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                    onClick={console.log}
                  />
                </span>
              </th>
              <th className="w-[20%]">
                <span className="flex items-center">
                  <p>Subaccount Name</p>
                  <SortIcon
                    className="w-3 h-3 ml-1 cursor-pointer dark:fill-gray-color-6 fill-black-color"
                    onClick={console.log}
                  />
                </span>
              </th>
              <th className="w-[20%]">Subaccount</th>
              <th className="w-[20%]">Account Identifier</th>
              <th className="w-[20%]"></th>
            </tr>
          </thead>
          <tbody>
            {contact?.accounts.map((currentAccount, index) => {
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
            <tr>
              <td colSpan={1}></td>
              <td colSpan={5}>
                <AddContactAccountRow contact={contact} />
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
