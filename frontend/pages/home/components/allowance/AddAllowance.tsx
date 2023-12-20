import Select from "@components/select";
import { Avatar } from "@components/avatar";
import DatePicker from "@components/datepicker";

const initialOptions = [
  {
    value: "regional-school",
    label: "Regional School",
    subLabel: "0x123...21321",
    icon: <Avatar title="Julio" size="medium" figure="rounded-lg" className="mr-3" />,
  },
  {
    value: "Ethereum",
    label: "Vacation",
    subLabel: "0x123...21321",
    icon: <Avatar title="Leonard" size="medium" figure="rounded-lg" className="mr-3" />,
  },
];

export default function AddAllowance() {
  return (
    <form className="flex flex-col text-left">
      <div className="mt-4">
        <label htmlFor="asset">Asset</label>
        <Select options={initialOptions} isLoading={false} onSelectChange={console.log} onSearchChange={console.log} />
        <DatePicker />
      </div>
    </form>
  );
}
