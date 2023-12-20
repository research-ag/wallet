import Drawer from "@components/drawer";
import AddAllowance from "./AddAllowance";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
}

export default function AllowanceDrawer(props: IAllowanceDrawerProps) {
  const { isDrawerOpen, setDrawerOpen } = props;

  return (
    <Drawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} title="Add Allowance">
      <AddAllowance />
    </Drawer>
  );
}
