// svg
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
//
import { useTranslation } from "react-i18next";
import { IUseContactFilters } from "../../hooks/useContactFilters";
import { CustomInput } from "@components/Input";
import { IconButton } from "@components/button";
import AssetFilter from "./AssetFilter";

export default function ContactFilters(props: IUseContactFilters) {
  const { t } = useTranslation();
  const { searchKey, assetFilter, assetOpen, setAssetFilter, setAssetOpen, setSearchKey, setAddOpen } = props;

  return (
    <div className="flex items-center justify-start w-full gap-3 text-md">
      <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor">{t("asset")}</p>
      <AssetFilter
        assetOpen={assetOpen}
        assetFilter={assetFilter}
        setAssetOpen={setAssetOpen}
        setAssetFilter={setAssetFilter}
      />

      <CustomInput
        compOutClass="!w-[40%]"
        prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
        intent={"secondary"}
        sizeInput={"medium"}
        placeholder={t("search.contact")}
        value={searchKey}
        onChange={(e) => {
          setSearchKey(e.target.value);
        }}
      />

      <IconButton
        icon={<PlusIcon className="w-6 h-6" />}
        size="medium"
        onClick={() => {
          setAddOpen(true);
        }}
      />
    </div>
  );
}
