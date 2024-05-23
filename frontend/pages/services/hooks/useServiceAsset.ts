import { useAppSelector } from "@redux/Store";

export default function useServiceAsset() {
  const { assets } = useAppSelector((state) => state.asset.list);

  function getAssetFromUserAssets(tokenSymbol: string) {
    return assets.find((ast) => ast.tokenSymbol === tokenSymbol);
  }

  return { getAssetFromUserAssets };
}
