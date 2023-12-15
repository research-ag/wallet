import Button from "@components/buttons/Button";
import PlusIcon from "@assets/svg/files/plus-icon.svg";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DetailTab({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="columns-2">
        <button onClick={() => setActiveTab("transactions")}>
          <p
            className={`text-md ${
              activeTab === "transactions" && "border-b-2 border-acceptButtonColor font-semibold text-acceptButtonColor"
            }`}
          >
            Transactions (10)
          </p>
        </button>
        <button onClick={() => setActiveTab("allowances")}>
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
