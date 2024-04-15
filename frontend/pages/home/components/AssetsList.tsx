//
import AssetElement from "./ICRC/asset/AssetElement";
import { Asset } from "@redux/models/AccountModels";
import { Fragment, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import AddAsset from "./ICRC/asset/AddAsset";
import { DrawerHook } from "../hooks/drawerHook";
import Menu from "@pages/components/Menu";
import { AssetHook } from "../hooks/assetHook";
import { UseAsset } from "../hooks/useAsset";
import SearchAsset from "./ICRC/asset/SearchAsset";

const AssetsList = () => {
  // TODO: remove worker hook once the worker is implemented
  // WorkerHook();
  UseAsset();
  const [addOpen, setAddOpen] = useState(false);
  const { assetOpen, setAssetOpen } = DrawerHook();

  const { assets, searchKey, setSearchKey, setAcordeonIdx, accordionIndex, assetInfo, setAssetInfo, selectedAsset } =
    AssetHook();

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-start w-[60%] max-w-[30rem] h-full pl-9 pt-6 dark:bg-PrimaryColor bg-PrimaryColorLight">
        <Menu />
        <SearchAsset searchKey={searchKey} setSearchKey={setSearchKey} onAddAsset={onAddAsset} />

        <div className="w-full max-h-[calc(100vh-13rem)] scroll-y-light">
          {assets?.length > 0 && (
            <Accordion.Root
              type="multiple"
              defaultValue={[]}
              value={
                (addOpen || assetOpen) && selectedAsset
                  ? [...accordionIndex, selectedAsset.tokenSymbol]
                  : accordionIndex
              }
              onValueChange={onValueChange}
            >
              {assets.map((asset: Asset, idx: number) => {
                const mySearchKey = searchKey.toLowerCase().trim();
                let includeInSub = false;
                asset.subAccounts.map((sa) => {
                  if (sa.name.toLowerCase().includes(mySearchKey)) includeInSub = true;
                });

                if (
                  asset.name?.toLowerCase().includes(mySearchKey) ||
                  asset.symbol?.toLowerCase().includes(mySearchKey) ||
                  includeInSub ||
                  searchKey.trim() === ""
                )
                  return (
                    <AssetElement
                      key={idx}
                      asset={asset}
                      idx={idx}
                      accordionIndex={accordionIndex}
                      setAssetInfo={setAssetInfo}
                      setAssetOpen={setAssetOpen}
                      setAddOpen={setAddOpen}
                    />
                  );
              })}
            </Accordion.Root>
          )}
        </div>
      </div>

      {assetOpen && (
        <div
          id="asset-drower"
          className={`h-full fixed top-0 w-[28rem] z-[1000] overflow-x-hidden transition-{right} duration-500 ${assetOpen ? "!right-0" : "right-[-30rem]"
            }`}
        >
          <AddAsset
            setAssetOpen={setAssetOpen}
            asset={assetInfo}
            setAssetInfo={setAssetInfo}
            assetOpen={assetOpen}
            assets={assets}
            accordionIndex={accordionIndex}
          />
        </div>
      )}
    </Fragment>
  );

  function onAddAsset() {
    setTimeout(() => {
      setAssetOpen(true);
    }, 150);
  }

  function onValueChange(e: string[]) {
    setAcordeonIdx(e);
  }
};

export default AssetsList;
