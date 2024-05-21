import Menu from "@pages/components/Menu";
import AllowanceFilter from "./components/AllowanceFilter";
import AllowanceList from "./components/AllowanceList";
import AddAllowanceDrawer from "./components/AddAllowanceDrawer";
import UpdateAllowanceDrawer from "./components/UpdateAllowanceDrawer";
import useAllowances from "./hooks/useAllowances";

export default function Allowances() {
  const { allowances, handleSortChange, setSearchKey, assetFilters, setAssetFilters } = useAllowances();
  return (
    <div className="pt-[1rem] px-[2.25rem]">
      <div>
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
