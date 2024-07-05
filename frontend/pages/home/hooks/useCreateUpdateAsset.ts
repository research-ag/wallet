import { ICRC1systemAssets } from "@/common/defaultTokens";
import { Asset } from "@redux/models/AccountModels";
import { useAppSelector } from "@redux/Store";
import { useEffect, useState } from "react";

export default function useCreateUpdateAsset() {
  const { icr1SystemAssets } = useAppSelector((state) => state.asset.utilData);

  const [newAssetList, setNewAssetList] = useState<Array<Asset>>(ICRC1systemAssets);
  const [assetTOpen, setAssetTOpen] = useState(false);
  const [networkTOpen, setNetworkTOpen] = useState(false);

  useEffect(() => setNewAssetList(icr1SystemAssets), [icr1SystemAssets]);

  return {
    newAssetList,
    assetTOpen,
    setAssetTOpen,
    networkTOpen,
    setNetworkTOpen,
  };
}
