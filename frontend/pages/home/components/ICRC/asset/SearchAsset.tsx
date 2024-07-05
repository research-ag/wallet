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
  const { assets } = useAppSelector((state) => state.asset.list);
  const { t } = useTranslation();

  useEffect(() => {
    // INFO: auto select asset, account and set accordion index on search
    if (searchKey === "") {
      if (assets.length > 0) {
        dispatch(setSelectedAsset(assets[0]));
        assets[0].subAccounts.length > 0 && dispatch(setSelectedAccount(assets[0].subAccounts[0]));
        dispatch(setAccordionAssetIdx([assets[0].tokenSymbol]));
      }
    }

    if (searchKey.trim().length > 0) {
      const searchKeyLower = searchKey.toLowerCase();
      const searchKeyFilteredAssets = assets.filter((asset) => {
        const isAssetNameIncluded = asset.name?.toLowerCase().includes(searchKeyLower);
        const isAssetSymbolIncluded = asset.symbol?.toLowerCase().includes(searchKeyLower);

        const isSubAccountIncluded = asset.subAccounts
          .map((subAccount) => {
            const isSubAccountNameIncluded = subAccount.name.toLowerCase().includes(searchKeyLower);
            const isSubAccountIdIncluded = subAccount.sub_account_id.toLowerCase().includes(searchKeyLower);
            return isSubAccountNameIncluded || isSubAccountIdIncluded;
          })
          .includes(true);

        return isAssetNameIncluded || isAssetSymbolIncluded || isSubAccountIncluded;
      });

      if (searchKeyFilteredAssets.length > 0) {
        const selectedAsset = searchKeyFilteredAssets[0];
        dispatch(setSelectedAsset(selectedAsset));
        selectedAsset.subAccounts.length > 0 && dispatch(setSelectedAccount(selectedAsset.subAccounts[0]));

        const accordionIndex = searchKeyFilteredAssets.map((asset) => asset.tokenSymbol);
        dispatch(setAccordionAssetIdx(accordionIndex));
      } else {
        if (assets.length > 0) {
          dispatch(setSelectedAsset(assets[0]));
          assets[0].subAccounts.length > 0 && dispatch(setSelectedAccount(assets[0].subAccounts[0]));
          dispatch(setAccordionAssetIdx([assets[0].tokenSymbol]));
        }
      }
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
