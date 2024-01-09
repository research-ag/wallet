import { Drawer } from "@components/drawer";
import UpdateForm from "./EditForm";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

export default function EditAllowanceDrawer(props: IAllowanceDrawerProps) {
  const { isDrawerOpen, onClose } = props;

  return (
    <Drawer isDrawerOpen={isDrawerOpen} onClose={onClose} title="Edit TAllowance">
      {isDrawerOpen ? <UpdateForm /> : <></>}
    </Drawer>
  );
}

// if amount is empty show error
// if no expiration, the expiration will be empty
// if expiration, the no expiration will be false
