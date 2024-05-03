// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddAsset from "./AddAsset";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { BasicDrawer } from "@components/drawer";
import { setAccordionAssetIdx, setSelectedAccount, setSelectedAsset } from "@redux/assets/AssetReducer";

interface SearchAssetProps {
  searchKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
}

export default function SearchAsset(props: SearchAssetProps) {
  const dispatch = useAppDispatch();
  const { searchKey, setSearchKey } = props;
  const { assets } = useAppSelector((state) => state.asset);
  const { selectedAsset, accordionIndex } = useAppSelector((state) => state.asset.helper);
  const [assetOpen, setAssetOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const auxAssets = assets.filter((asset) => {
      let includeInSub = false;
      asset.subAccounts?.map((sa) => {
        if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) includeInSub = true;
      });

      return asset.name?.toLowerCase().includes(searchKey.toLowerCase()) || includeInSub || searchKey === "";
    });

    // -----------------
    if (auxAssets.length > 0) {
      const auxAccordion: string[] = [];

      auxAssets.map((ast) => {
        if (accordionIndex.includes(ast.tokenSymbol)) auxAccordion.push(ast.tokenSymbol);
      });

      dispatch(setAccordionAssetIdx(auxAccordion));

      const isSelected = auxAssets.find((ast) => ast.tokenSymbol === selectedAsset?.tokenSymbol);
      if (selectedAsset && !isSelected) {
        dispatch(setSelectedAsset(auxAssets[0]));
        auxAssets[0].subAccounts.length > 0 && dispatch(setSelectedAccount(auxAssets[0].subAccounts[0]));
      }
    } else {
      dispatch(setAccordionAssetIdx([]));
    }
  }, [searchKey]);

  // TODO: add debounce to setSearchKey

  return (
    <div className="flex flex-row items-center justify-start w-full gap-3 pr-5 mb-4">
      <input
        className="dark:bg-PrimaryColor bg-PrimaryColorLight text-PrimaryTextColorLight dark:text-PrimaryTextColor border-SearchInputBorderLight dark:border-SearchInputBorder w-full h-8 rounded-lg border-[1px] outline-none px-3 text-md"
        type="text"
        placeholder={t("search")}
        value={searchKey}
        onChange={(e) => {
          setSearchKey(e.target.value);
        }}
        autoComplete="false"
        spellCheck={false}
      />
      <div
        className="flex flex-row items-center justify-center w-8 h-8 rounded-md cursor-pointer bg-SelectRowColor"
        onClick={onAddAsset}
      >
        <img src={PlusIcon} alt="plus-icon" />
      </div>

      {assetOpen && (
        <BasicDrawer isDrawerOpen={assetOpen}>
          <AddAsset setAssetOpen={setAssetOpen} assetOpen={assetOpen} accordionIndex={accordionIndex} />
        </BasicDrawer>
      )}
    </div>
  );

  function onAddAsset() {
    setAssetOpen(true);
  }
}
