import { Asset, AssetToAdd } from "@redux/models/AccountModels";
import ContactAssetPop from "../contactAssetPop";
import SubAccountFormItem from "./SubAccountFormItem";
import { AssetContact, Contact } from "@redux/models/ContactsModels";
import { getAssetIcon } from "@/utils/icons";

interface ContactAssetDetailsProps {
  assets: Array<Asset>;
  newContact: Contact;
  selAstContact: string;
  isValidSubacc: (from: string, validContact: boolean, contAst?: AssetContact) => any;
  newContactSubNameErr: number[];
  newContactSubIdErr: number[];
  asciiHex: string[];
  setSelAstContact: any;
  setNewContactSubIdErr: any;
  setNewSubaccounts: any;
  setNewContactErr: any;
  setNewContactSubNameErr: any;
  newSubAccounts: any;
  setNewContact: any;
}

export default function ContactAssetDetails(props: ContactAssetDetailsProps) {
  const {
    assets,
    newContact,
    selAstContact,
    isValidSubacc,
    newSubAccounts,
    setNewSubaccounts,
    newContactSubNameErr,
    newContactSubIdErr,
    setNewContact,
    setNewContactSubNameErr,
    setNewContactErr,
    setNewContactSubIdErr,
    asciiHex,
    setSelAstContact,
  } = props;

  return (
    <div className="flex flex-row items-center justify-center w-full gap-3 rounded-sm h-72 bg-ThirdColorLight dark:bg-ThirdColor">
      {newContact.assets.length === 0 ? (
        <ContactAssetPop
          assets={assets}
          getAssetIcon={getAssetIcon}
          btnClass="bg-AddSecondaryButton rounded-l-sm w-8 h-8"
          onAdd={(data) => {
            assetToAddEmpty(data);
          }}
        />
      ) : (
        <SubAccountFormItem
          assets={assets}
          newContact={newContact}
          selAstContact={selAstContact}
          isValidSubacc={isValidSubacc}
          newSubAccounts={newSubAccounts}
          setNewSubaccounts={setNewSubaccounts}
          newContactSubNameErr={newContactSubNameErr}
          newContactSubIdErr={newContactSubIdErr}
          setNewContact={setNewContact}
          setNewContactSubNameErr={setNewContactSubNameErr}
          setNewContactErr={setNewContactErr}
          setNewContactSubIdErr={setNewContactSubIdErr}
          asciiHex={asciiHex}
        />
      )}
    </div>
  );

  function assetToAddEmpty(data: AssetToAdd[]) {
    let auxConatct: Contact = {
      name: "",
      principal: "",
      assets: [],
    };

    setNewContact((prev: Contact) => {
      auxConatct = {
        ...prev,
        assets: data.map((ata) => {
          return {
            symbol: ata.symbol,
            tokenSymbol: ata.tokenSymbol,
            subaccounts: [],
            logo: ata.logo,
            address: ata.address,
            decimal: ata.decimal,
            shortDecimal: ata.shortDecimal,
            supportedStandards: ata.supportedStandards,
          };
        }),
      };
      return auxConatct;
    });

    if (data[0]) {
      setSelAstContact(data[0].tokenSymbol);
      const auxAsset = auxConatct.assets.find((ast) => ast.tokenSymbol === data[0].tokenSymbol);
      if (auxAsset)
        setNewSubaccounts(
          auxAsset.subaccounts.length === 0
            ? [{ name: "", subaccount_index: "", sub_account_id: "" }]
            : auxAsset.subaccounts,
        );
    }
  }
}
