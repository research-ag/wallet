import { assetMutateInitialState } from "@pages/home/hooks/useAssetMutate";
import { Asset } from "@redux/models/AccountModels";
import { Contact } from "@redux/models/ContactsModels";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SubAccountTable({ contact }: { contact: Contact }) {
  const { t } = useTranslation();
  const [newAsset, setNewAsset] = useState<Asset | null>(null);

  return (
    <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
      <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">

        <table className="w-full text-left">
          <thead className="h-[2.8rem]">
            <tr>
              <th className="w-[5%]"></th>
              <th className="w-[5%]"></th>
              <th className="w-[20%]">Asset</th>
              <th className="w-[20%]">Name</th>
              <th className="w-[25%]">Sub-account</th>
              <th className="w-[20%]">Account Identifier</th>
              <th className="w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {contact?.assets.map((currentAsset, index) => {

              return (
                <tr key={index} className="h-[2.8rem]">
                  <td></td>
                  <td className="h-full">
                    <div className="relative flex flex-col items-center justify-center w-full h-full">
                      <div className="w-1 h-1 bg-SelectRowColor"></div>
                      {index !== 0 && (
                        <div className="absolute bottom-0 w-1 h-12 border-l border-dotted left-1/2 border-SelectRowColor"></div>
                      )}
                    </div>
                  </td>
                  <th className="w-[20%]">Asset</th>
                  <th className="w-[20%]">Name</th>
                  <th className="w-[25%]">Sub-account</th>
                  <th className="w-[20%]">Account Identifier</th>
                  <th className="w-[5%]"></th>
                </tr>
              );
            })}
          </tbody>
        </table>


      </td>
    </tr>
  );

  function onAddNewSubAcount() {
    setNewAsset(assetMutateInitialState);
  }
}
