import Menu from "@pages/components/Menu";
import AllowanceFilter from "./components/AllowanceFilter";
import AllowanceList from "./components/AllowanceList";
import AddAllowanceDrawer from "./components/AddAllowanceDrawer";
import UpdateAllowanceDrawer from "./components/UpdateAllowanceDrawer";

export default function Allowances() {
  return (
    <div className="px-[2rem]">
      <div className="flex items-center justify-between mb-[2rem] mt-[2rem]">
        <Menu />
        <AllowanceFilter />
      </div>
      <AllowanceList />
      <AddAllowanceDrawer />
      <UpdateAllowanceDrawer />
    </div>
  );
}
