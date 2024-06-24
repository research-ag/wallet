import AddAssetOnCreate from "./AddAssetOnCreate";
import { Asset } from "@redux/models/AccountModels";
import { Dispatch, SetStateAction } from "react";
import AddSubAccountOnCreate from "./AssSubAccounOnCreate";

interface SubAccountFormItemProps {
  contactAssetSelected: string;
  contactAssets: Asset[];
  setContactAssetSelected: Dispatch<SetStateAction<string>>;
  setContactAssets: Dispatch<SetStateAction<Asset[]>>;
}

export default function SubAccountFormItem(props: SubAccountFormItemProps) {
  const { contactAssets, setContactAssetSelected, setContactAssets, contactAssetSelected } = props;

  return (
    <div className="flex flex-row items-start justify-start w-full h-full">
      <AddAssetOnCreate
        contactAssets={contactAssets}
        setContactAssetSelected={setContactAssetSelected}
        setContactAssets={setContactAssets}
        contactAssetSelected={contactAssetSelected}
      />
      <AddSubAccountOnCreate contactAssetSelected={contactAssetSelected} />
    </div>
  );
}
