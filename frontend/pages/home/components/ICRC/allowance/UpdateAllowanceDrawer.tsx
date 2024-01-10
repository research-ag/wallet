import { Drawer } from "@components/drawer";
import useAllowanceDrawer from "@pages/home/hooks/useAllowanceDrawer";
import { useTranslation } from "react-i18next";
import UpdateForm from "./UpdateForm";

export default function UpdateAllowanceDrawer() {
  const { t } = useTranslation();
  const { isUpdateAllowance, onCloseUpdateAllowanceDrawer } = useAllowanceDrawer();

  return (
    <Drawer
      isDrawerOpen={isUpdateAllowance}
      onClose={onCloseUpdateAllowanceDrawer}
      title={t("allowance.edit.allowance")}
    >
      {isUpdateAllowance ? <UpdateForm /> : <></>}
    </Drawer>
  );
}
