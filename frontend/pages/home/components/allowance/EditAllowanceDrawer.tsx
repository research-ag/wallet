import { Drawer } from "@components/drawer";
import UpdateForm from "./EditForm";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

export default function EditAllowanceDrawer(props: IAllowanceDrawerProps) {
  const { t } = useTranslation();
  const { isDrawerOpen, onClose } = props;

  return (
    <Drawer isDrawerOpen={isDrawerOpen} onClose={onClose} title={t("allowance.edit.allowance")}>
      {isDrawerOpen ? <UpdateForm /> : <></>}
    </Drawer>
  );
}

// if amount is empty show error
// if no expiration, the expiration will be empty
// if expiration, the no expiration will be false
