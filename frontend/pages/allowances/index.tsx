import Menu from "@pages/components/Menu";
import AllowanceFilter from "./components/AllowanceFilter";
import AllowanceList from "./components/AllowanceList";
import AddAllowanceDrawer from "./components/AddAllowanceDrawer";
import UpdateAllowanceDrawer from "./components/UpdateAllowanceDrawer";
import useAllowances from "./hooks/useAllowances";

export default function Allowances() {
  const { allowances, handleSortChange, setSearchKey, assetFilters, setAssetFilters } = useAllowances();
  return (
    <div className="flex flex-col w-full pt-[1rem] px-[2rem]">
      <div className="flex items-center justify-between">
        <Menu />
        <AllowanceFilter
          setSearchKey={setSearchKey}
          selectedAssets={assetFilters}
          setSelectedAssets={setAssetFilters}
        />
      </div>
      <AllowanceList allowances={allowances} handleSortChange={handleSortChange} />
      <AddAllowanceDrawer />
      <UpdateAllowanceDrawer />
    </div>
  );
}
