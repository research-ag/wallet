import Menu from "@pages/components/Menu";
import AllowanceFilter from "./components/AllowanceFilter";
import AllowanceList from "./components/AllowanceList";

export default function Allowances() {
  return (
    <div className="px-[2rem]">
      <div className="flex items-center justify-between mb-[1rem] mt-[2rem]">
        <Menu />
        <AllowanceFilter />
      </div>
      <AllowanceList />
    </div>
  );
}
