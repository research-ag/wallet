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
  const { contactAssetSelected, contactAssets, setContactAssets, setContactAssetSelected } = props;
  const assets = useAppSelector((state) => state.asset.list.assets);
  const { t } = useTranslation();

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

  function assetToAdd(data: Asset[]) {
    setContactAssets((prev: Asset[]) => [...prev, ...data]);
  }
}
