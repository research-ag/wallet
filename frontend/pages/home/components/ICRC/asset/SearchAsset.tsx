// svgs
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { setAccordionAssetIdx, setSelectedAccount, setSelectedAsset } from "@redux/assets/AssetReducer";

interface SearchAssetProps {
  searchKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
}

export default function SearchAsset(props: SearchAssetProps) {
  const { searchKey, setSearchKey } = props;
  const dispatch = useAppDispatch();
  const { selectedAsset, accordionIndex } = useAppSelector((state) => state.asset.helper);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { t } = useTranslation();

  useEffect(() => {
    const auxAssets = assets.filter((asset) => {
      let includeInSub = false;
      asset.subAccounts?.map((sa) => {
        if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) includeInSub = true;
      });

      return asset.name?.toLowerCase().includes(searchKey.toLowerCase()) || includeInSub || searchKey === "";
    });

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

  return (
    <input
      className="dark:bg-PrimaryColor bg-PrimaryColorLight text-PrimaryTextColorLight dark:text-PrimaryTextColor border-SearchInputBorderLight dark:border-SearchInputBorder w-full h-8 rounded-lg border-[1px] outline-none px-3 text-md"
      type="text"
      placeholder={t("search")}
      value={searchKey}
      onChange={(e) => setSearchKey(e.target.value)}
      autoComplete="false"
      spellCheck={false}
    />
  );
}
