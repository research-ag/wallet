import Button from "@components/buttons/Button";
import PlusIcon from "@assets/svg/files/plus-icon.svg";
import { DetailsTabs } from "@/const";

interface Props {
  activeTab: string;
  setActiveTab: (tab: DetailsTabs) => void;
}

export default function DetailTab({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="columns-2 flex justify-between items-center">
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
      <div className="columns-2 flex justify-between items-center">
        <p className="mx-2 text-md">Add allowance</p>
        <Button>
          <img src={PlusIcon} alt="plus-icon" />
        </Button>
      </div>
    </div>
  );
}
