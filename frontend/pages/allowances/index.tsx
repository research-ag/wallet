import Menu from "@pages/components/Menu";
import AllowanceFilter from "./components/AllowanceFilter";
import AllowanceList from "./components/AllowanceList";
import AddAllowanceDrawer from "./components/AddAllowanceDrawer";
import UpdateAllowanceDrawer from "./components/UpdateAllowanceDrawer";
import useAllowances from "./hooks/useAllowances";

export default function Allowances() {
  const { allowances, handleSortChange, searchKey, setSearchKey, selectedAssets, setSelectedAssets } = useAllowances();
  return (
    <div className="px-[2rem]">
      <div className="flex items-center justify-between mb-[2rem] mt-[2rem]">
        <Menu />
        <AllowanceFilter
          setSearchKey={setSearchKey}
          selectedAssets={selectedAssets}
          setSelectedAssets={setSelectedAssets}
        />
      </div>
      <AllowanceList
        allowances={allowances}
        handleSortChange={handleSortChange}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        selectedAssets={selectedAssets}
        setSelectedAssets={setSelectedAssets}
      />
      <AddAllowanceDrawer />
      <UpdateAllowanceDrawer />
    </div>
  );
}
