import Button from "@components/buttons/Button";
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { DetailsTabs } from "@/const";
import { useState } from "react";
import DrawerAllowance from "./allowance/AllowanceDrawer";

interface Props {
  activeTab: string;
  setActiveTab: (tab: DetailsTabs) => void;
}

export default function DetailTab({ activeTab, setActiveTab }: Props) {
  const [allowanceDrawerOpen, setAllowanceDrawerOpen] = useState(false);
  return (
    <div className="flex items-center justify-between w-full">
      <DrawerAllowance isDrawerOpen={allowanceDrawerOpen} setDrawerOpen={setAllowanceDrawerOpen} />

      <div className="flex items-center justify-between columns-2">
        <button onClick={() => setActiveTab(DetailsTabs.transactions)}>
          <p
            className={`text-md ${
              activeTab === "transactions" && "border-b-2 border-acceptButtonColor font-semibold text-acceptButtonColor"
            }`}
          >
            Transactions (10)
          </p>
        </button>

        <button onClick={() => setActiveTab(DetailsTabs.allowances)}>
          <p
            className={`text-md ${
              activeTab === "allowances" && "border-b-2 border-acceptButtonColor font-semibold text-acceptButtonColor"
            }`}
          >
            Allowances (6)
          </p>
        </button>
      </div>
      <div className="flex items-center justify-between columns-2">
        <p className="mx-2 text-md">Add allowance</p>
        <Button onClick={() => setAllowanceDrawerOpen(!allowanceDrawerOpen)}>
          <img src={PlusIcon} alt="plus-icon" />
        </Button>
      </div>
    </div>
  );
}
