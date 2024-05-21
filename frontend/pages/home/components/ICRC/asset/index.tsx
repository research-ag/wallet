import { Fragment, useState } from "react";
import Menu from "@pages/components/Menu";
import SearchAsset from "@/pages/home/components/ICRC/asset/SearchAsset";
import AssetAccordion from "./AssetAccordion";
import AssetMutate from "./AssetMutate";
import { UseAsset } from "@pages/home/hooks/useAsset";

export default function AssetsList() {
  UseAsset();
  const [searchKey, setSearchKey] = useState("");

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-start w-[60%] max-w-[30rem] h-full pl-9 pt-[1rem] dark:bg-PrimaryColor bg-PrimaryColorLight">
        <Menu />
        <div className="flex flex-row items-center justify-start w-full gap-3 pr-5 mb-4">
          <SearchAsset searchKey={searchKey} setSearchKey={setSearchKey} />
          <AssetMutate />
        </div>
        <AssetAccordion searchKey={searchKey} />
      </div>
    </Fragment>
  );
}
