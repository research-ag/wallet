import { Asset, AssetToAdd } from "@redux/models/AccountModels";
import { AssetContact, Contact, SubAccountContact } from "@redux/models/ContactsModels";
import ContactAssetPop from "../contactAssetPop";
import { getAssetIcon } from "@/common/utils/icons";
import ContactAssetElement from "../contactAssetElement";
import { removeLeadingZeros } from "@/utils";
import { useTranslation } from "react-i18next";

interface AddAssetOnCreateProps {
  assets: Array<Asset>;
  newContact: Contact;
  newSubAccounts: SubAccountContact[];
  selAstContact: string;
  isValidSubacc: (from: string, validContact: boolean, contAst?: AssetContact) => any;
  setNewSubaccounts: any;
  setNewContact: any;
}

export default function AddAssetOnCreate(props: AddAssetOnCreateProps) {
  const { t } = useTranslation();
  const { isValidSubacc, setNewContact, assets, newContact, selAstContact, newSubAccounts, setNewSubaccounts } = props;

  return (
    <div className="flex flex-col justify-start items-start w-[70%] h-full">
      <div className="flex flex-row items-center justify-between w-full p-3">
        <p className="whitespace-nowrap">{t("add.assets")}</p>
        {assets.filter((ast) => {
          let isIncluded = false;
          for (let index = 0; index < newContact.assets.length; index++) {
            if (newContact.assets[index].tokenSymbol === ast.tokenSymbol) {
              isIncluded = true;
              break;
            }
          }
          return !isIncluded;
        }).length != 0 && (
          <ContactAssetPop
            assets={assets.filter((ast) => {
              let isIncluded = false;
              newContact.assets.map((contAst) => {
                if (ast.tokenSymbol === contAst.tokenSymbol) isIncluded = true;
              });
              return !isIncluded;
            })}
            compClass="flex flex-row justify-end items-center w-full"
            getAssetIcon={getAssetIcon}
            onAdd={(data) => {
              assetToAdd(data);
            }}
          />
        )}
      </div>

      <div className="flex flex-col w-full h-full scroll-y-light">
        {newContact.assets.map((contAst, k) => {
          return (
            <ContactAssetElement
              key={k}
              contAst={contAst}
              k={k}
              selAstContact={selAstContact}
              isValidSubacc={() => {
                isValidSubacc("change", true, contAst);
              }}
              isAvailableAddContact={isAvailableAddContact}
              newSubAccounts={newSubAccounts}
              setNewSubaccounts={setNewSubaccounts}
            ></ContactAssetElement>
          );
        })}
      </div>
    </div>
  );

  function isAvailableAddContact() {
    let isAvailable = true;
    const ids: string[] = [];

    for (let index = 0; index < newSubAccounts.length; index++) {
      const newSa = newSubAccounts[index];
      let subAccIdx = "";
      if (removeLeadingZeros(newSa.subaccount_index.trim()) === "") {
        if (newSa.subaccount_index.length !== 0) subAccIdx = "0";
      } else subAccIdx = removeLeadingZeros(newSa.subaccount_index.trim());

      if (newSa.name.trim() === "") {
        isAvailable = false;
        break;
      }

      if (subAccIdx === "" || ids.includes(subAccIdx)) {
        isAvailable = false;
        break;
      } else {
        ids.push(subAccIdx);
      }
    }
    return isAvailable;
  }

  function assetToAdd(data: AssetToAdd[]) {
    setNewContact((prev: Contact) => {
      return {
        ...prev,
        assets: [
          ...prev.assets,
          ...data.map((ata) => {
            return {
              symbol: ata.symbol,
              tokenSymbol: ata.tokenSymbol,
              logo: ata.logo,
              subaccounts: [],
              address: ata.address,
              decimal: ata.decimal,
              shortDecimal: ata.shortDecimal,
            };
          }),
        ],
      };
    });
  }
}
