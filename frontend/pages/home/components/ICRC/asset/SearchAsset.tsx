// svgs
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { useTranslation } from "react-i18next";

interface SearchAssetProps {
  searchKey: string;
  setSearchKey(value: string): void;
  onAddAsset(): void;
}

export default function SearchAsset(props: SearchAssetProps) {
  const { t } = useTranslation();
  const { searchKey, setSearchKey, onAddAsset } = props;

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
    </div>
  );
}
