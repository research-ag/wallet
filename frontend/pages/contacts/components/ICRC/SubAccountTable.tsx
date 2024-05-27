import { assetMutateInitialState } from "@pages/home/hooks/useAssetMutate";
import { Asset } from "@redux/models/AccountModels";
import { Contact } from "@redux/models/ContactsModels";
import { useState } from "react";
// import { useTranslation } from "react-i18next";

export default function SubAccountTable({ contact }: { contact: Contact }) {
  // const { t } = useTranslation();
  const [newAsset, setNewAsset] = useState<Asset | null>(null);

  return (
    <tr className="bg-SecondaryColorLight dark:bg-SecondaryColor">
      <td colSpan={4} className="w-full h-4 border-BorderColorTwoLight dark:border-BorderColorTwo">
        <table>
          <thead className="text-PrimaryTextColor/70"></thead>
          <tbody>
            {contact?.assets.map((currentAsset, index) => {
              return (
                <tr key={index}>
                  <td className="h-full">{currentAsset.tokenSymbol}</td>
                </tr>
              );
            })}

            <tr>
              {newAsset ? (
                <td>
                  <p>Row add sub account</p>
                </td>
              ) : (
                <td>
                  <button onClick={onAddNewSubAcount}>ADD</button>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );

  function onAddNewSubAcount() {
    setNewAsset(assetMutateInitialState);
  }
}
