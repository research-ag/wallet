import { ReactComponent as SortIcon } from "@assets/svg/files/sort.svg";
import { Contact } from "@/@types/contacts";
// import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { IconTypeEnum } from "@common/const";
// import { getAssetIcon } from "@common/utils/icons";
// import { shortAddress } from "@common/utils/icrc";
// import { AvatarEmpty } from "@components/avatar";
// import Avatar from "@components/avatar/BasicAvatar";
// import { CustomCopy } from "@components/tooltip";
// import { assetMutateInitialState } from "@pages/home/hooks/useAssetMutate";
// import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import logger from "@common/utils/logger";
import AddContactAccountRow from "./AddContactAccountRow";
import DisplayContactAccountRow from "../DisplayContactAccountRow";

export default function SubAccountTable({ contact }: { contact: Contact }) {
  // const { t } = useTranslation();
  // const [newAsset, setNewAsset] = useState<Asset | null>(null);
  const assets = useAppSelector((state) => state.asset.list.assets);

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
