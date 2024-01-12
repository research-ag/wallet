// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
//
import { AssetContact, SubAccountContact } from "@redux/models/ContactsModels";
import { GeneralHook } from "@pages/home/hooks/generalHook";
import { IconTypeEnum } from "@/const";

interface ContactAssetElementProps {
  contAst: AssetContact;
  k: number;
  selAstContact: string;
  isValidSubacc(): void;
  isAvailableAddContact(): boolean;
  newSubAccounts: Array<SubAccountContact>;
  setNewSubaccounts(value: any): void;
}

const ContactAssetElement = ({
  contAst,
  k,
  selAstContact,
  isValidSubacc,
  isAvailableAddContact,
  newSubAccounts,
  setNewSubaccounts,
}: ContactAssetElementProps) => {
  const { getAssetIcon } = GeneralHook();

  return (
    <button
      key={k}
      onClick={onClicAssetElem}
      className={`flex flex-row justify-between items-center w-full p-3 ${
        contAst.tokenSymbol === selAstContact
          ? "bg-SecondaryColorLight dark:bg-SecondaryColor border-0 border-l-4 border-SelectRowColor"
          : ""
      }`}
    >
      <div className="flex flex-row items-center justify-start gap-3">
        {getAssetIcon(IconTypeEnum.Enum.FILTER, contAst.tokenSymbol, contAst.logo)}
        <p>{contAst.symbol}</p>
      </div>
      <div className="flex flex-row items-center justify-between h-8 rounded w-28 bg-black/10 dark:bg-white/10">
        <p className="ml-2">{`${
          contAst.tokenSymbol === selAstContact ? newSubAccounts.length : contAst.subaccounts.length
        } ${
          (contAst.tokenSymbol === selAstContact ? newSubAccounts.length : contAst.subaccounts.length) !== 1
            ? "Subs"
            : "Sub"
        }`}</p>
        {contAst.tokenSymbol === selAstContact && (
          <button
            onClick={onAddSub}
            className="flex items-center justify-center w-8 h-8 p-0 rounded-r bg-AddSecondaryButton"
          >
            <img src={PlusIcon} alt="plus-icon" className="w-5 h-5" />
          </button>
        )}
      </div>
    </button>
  );

  function onClicAssetElem() {
    if (selAstContact !== contAst.tokenSymbol) {
      isValidSubacc();
    }
  }

  function onAddSub() {
    if (isAvailableAddContact())
      setNewSubaccounts((prev: any) => {
        return [...prev, { name: "", subaccount_index: "", sub_account_id: "" }];
      });
  }
};
export default ContactAssetElement;
