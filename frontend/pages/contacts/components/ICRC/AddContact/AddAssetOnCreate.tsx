import { useAppSelector } from "@redux/Store";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction } from "react";
import { Asset } from "@redux/models/AccountModels";
import ContactAssetPop from "../contactAssetPop";
import ContactAssetElement from "../contactAssetElement";

interface AddAssetOnCreateProps {
  contactAssetSelected: string;
  setContactAssetSelected: Dispatch<SetStateAction<string>>;
  contactAssets: Asset[];
  setContactAssets: Dispatch<SetStateAction<Asset[]>>;
}

export default function AddAssetOnCreate(props: AddAssetOnCreateProps) {
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { t } = useTranslation();
  const { contactAssetSelected, contactAssets, setContactAssets, setContactAssetSelected } = props;

  const unselectedAssets = assets.filter(
    (currentAsset) => contactAssets.find((asset) => asset.tokenSymbol === currentAsset.tokenSymbol) === undefined,
  );

  return (
    <div className="flex flex-col justify-start items-start w-[70%] h-full">
      <div className="flex flex-row items-center justify-between w-full p-3">
        <p className="whitespace-nowrap">{t("add.assets")}</p>
        {unselectedAssets.length !== 0 && (
          <ContactAssetPop
            assets={unselectedAssets}
            compClass="flex flex-row justify-end items-center w-full"
            onAdd={assetToAdd}
          />
        )}
      </div>

      <div className="flex flex-col w-full h-full scroll-y-light">
        {contactAssets.map((contAst, index) => (
          <ContactAssetElement
            key={index}
            contAst={contAst}
            interator={index}
            contactAssetSelected={contactAssetSelected}
            setContactAssetSelected={setContactAssetSelected}
          />
        ))}
      </div>
    </div>
  );

  // async function isValidSubacc() {
  // TODO: remove the select asset logic to another function (OK)
  // INFO: change asset tab
  // setNewContact(auxContact);
  // setSelAstContact(contAst.tokenSymbol);
  // setNewSubaccounts(
  //   contAst.subaccounts.length === 0
  //     ? [{ name: "", subaccount_index: "", sub_account_id: "", allowance: { allowance: "", expires_at: "" } }]
  //     : contAst.subaccounts,
  // );
  // TODO: after validation save data (PENDING)
  // INFO: create contact into redux and local storage
  // setIsCreating(true);
  // const result = await retrieveAssetsWithAllowance({
  //   accountPrincipal: newContact.principal,
  //   assets: newContact.assets,
  // });
  // const reduxContact = {
  //   ...auxContact,
  //   assets: result,
  //   accountIdentier: getAccountIdentifier(auxContact.principal, 0),
  // };
  // await db().addContact(reduxContact, { sync: true });
  // setIsCreating(false);
  // onClose();
  // }

  // function isAvailableAddContact() {
  //   return true;
  // TODO: move this logic to the respective compoent (PENDING)
  //   let isAvailable = true;
  //   const ids: string[] = [];

  //   for (let index = 0; index < newSubAccounts.length; index++) {
  //     const newSa = newSubAccounts[index];
  //     let subAccIdx = "";
  //     if (removeLeadingZeros(newSa.subaccount_index.trim()) === "") {
  //       if (newSa.subaccount_index.length !== 0) subAccIdx = "0";
  //     } else subAccIdx = removeLeadingZeros(newSa.subaccount_index.trim());

  //     if (newSa.name.trim() === "") {
  //       isAvailable = false;
  //       break;
  //     }

  //     if (subAccIdx === "" || ids.includes(subAccIdx)) {
  //       isAvailable = false;
  //       break;
  //     } else {
  //       ids.push(subAccIdx);
  //     }
  //   }
  //   return isAvailable;
  // }

  function assetToAdd(data: Asset[]) {
    setContactAssets((prev: Asset[]) => [...prev, ...data]);
  }
}
