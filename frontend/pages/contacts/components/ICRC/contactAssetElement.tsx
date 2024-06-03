// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
//
import { IconTypeEnum } from "@/common/const";
import { getAssetIcon } from "@/common/utils/icons";
import { Asset } from "@redux/models/AccountModels";
import { Dispatch, SetStateAction } from "react";
import clsx from "clsx";
import { Contact } from "@/@types/contacts";
import { useContact } from "@pages/contacts/contexts/ContactProvider";

interface ContactAssetElementProps {
  contAst: Asset;
  interator: number;
  contactAssetSelected: string;
  setContactAssetSelected: Dispatch<SetStateAction<string>>;
}

const ContactAssetElement = (props: ContactAssetElementProps) => {
  const { contAst, interator, contactAssetSelected, setContactAssetSelected } = props;
  const { newContact, setNewContact } = useContact();

  const isCurrentAssetSelected = contAst.tokenSymbol === contactAssetSelected;

  const assetSubAccounts = newContact.accounts.filter((curr) => curr.tokenSymbol === contAst.tokenSymbol);
  const isLastIncomplete = newContact.accounts.filter((curr) => !curr.name || !curr.subaccountId).length > 0;
  const onSelectedCount = assetSubAccounts.length;
  const onUnselectedCount = isLastIncomplete ? newContact.accounts.length - 1 : newContact.accounts.length;

  return (
    <div key={interator} onClick={onSelectContactAsset} className={assetElementStyles(isCurrentAssetSelected)}>
      <div className="flex flex-row items-center justify-start gap-3">
        {getAssetIcon(IconTypeEnum.Enum.FILTER, contAst.tokenSymbol, contAst.logo)}
        <p>{contAst.symbol}</p>
      </div>
      <div className="flex flex-row items-center justify-between h-8 rounded w-28 bg-black/10 dark:bg-white/10">
        {/* TODO: text display on count */}
        <p className="ml-2">{isCurrentAssetSelected ? onSelectedCount : onUnselectedCount} Subs</p>

        {contAst.tokenSymbol === contactAssetSelected && (
          <button
            onClick={onAddSubaccountEnabled}
            className="flex items-center justify-center w-8 h-8 p-0 rounded-r bg-AddSecondaryButton"
          >
            <img src={PlusIcon} alt="plus-icon" className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  function onSelectContactAsset() {
    // TODO: do not allow change selected if sub-account name or id is beign edited (show error on valid data)
    // TODO: remove all pending adding sub account if (empty name and sub account id)
    setContactAssetSelected(contAst.tokenSymbol);
  }

  function onAddSubaccountEnabled() {
    const isNewSubAccountBeingAdded = newContact.accounts
      .map((curr) => {
        return !curr.tokenSymbol || !curr.name || !curr.subaccount || !curr.subaccountId;
      })
      .some((curr) => curr);

    if (isNewSubAccountBeingAdded) return;

    setNewContact((prev: Contact) => ({
      ...prev,
      accounts: [...prev.accounts, { name: "", subaccount: "", subaccountId: "", tokenSymbol: contAst.tokenSymbol }],
    }));
  }
};

const assetElementStyles = (isSelected: boolean) => {
  return clsx("flex flex-row justify-between items-center w-full p-3  cursor-pointer", {
    "bg-SecondaryColorLight dark:bg-SecondaryColor border-0 border-l-4 border-primary-color": isSelected,
  });
};

export default ContactAssetElement;
