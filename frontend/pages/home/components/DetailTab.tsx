import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
import { DetailsTabs } from "@/const";
import AddAllowanceDrawer from "./allowance/AddAllowanceDrawer";
import { useAppSelector } from "@redux/Store";
import { IconButton } from "@components/buttons";
import { CreateActionType, setCreateAllowanceDrawerState } from "@redux/allowances/AllowanceActions";

interface Props {
  activeTab: string;
  setActiveTab: (tab: DetailsTabs) => void;
}

export default function DetailTab({ activeTab, setActiveTab }: Props) {
  const { isCreateAllowance } = useAppSelector((state) => state.allowance);

  return (
    <div className="flex items-center justify-between w-full">
      <AddAllowanceDrawer
        isDrawerOpen={isCreateAllowance}
        onClose={() => setCreateAllowanceDrawerState(CreateActionType.closeDrawer)}
      />

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
        <IconButton icon={<PlusIcon />} onClick={() => setCreateAllowanceDrawerState(CreateActionType.openDrawer)} />
      </div>
    </div>
  );
}
