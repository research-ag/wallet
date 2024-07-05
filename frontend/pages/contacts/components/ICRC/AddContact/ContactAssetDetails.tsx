import { Dispatch, SetStateAction, useState } from "react";
import ContactAssetPop from "@/pages/contacts/components/ICRC/contactAssetPop";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import SubAccountFormItem from "@pages/contacts/components/ICRC/AddContact/SubAccountFormItem";

interface ContactAssetDetailsProps {
  contactAssetSelected: string;
  setContactAssetSelected: Dispatch<SetStateAction<string>>;
}

export default function ContactAssetDetails(props: ContactAssetDetailsProps) {
  const { contactAssetSelected, setContactAssetSelected } = props;
  const assets = useAppSelector((state) => state.asset.list.assets);
  const [contactAssets, setContactAssets] = useState<Asset[]>([]);

  return (
    <div className="flex flex-row items-center justify-center w-full gap-3 rounded-sm h-72 bg-ThirdColorLight dark:bg-ThirdColor">
      {contactAssets.length === 0 ? (
        <ContactAssetPop assets={assets} btnClass="bg-AddSecondaryButton rounded-l-sm w-8 h-8" onAdd={onSelectAssets} />
      ) : (
        <SubAccountFormItem
          contactAssets={contactAssets}
          contactAssetSelected={contactAssetSelected}
          setContactAssetSelected={setContactAssetSelected}
          setContactAssets={setContactAssets}
        />
      )}
    </div>
  );

  function onSelectAssets(data: Asset[]) {
    setContactAssets(data);
    setContactAssetSelected(data[0]?.tokenSymbol);
  }
}
