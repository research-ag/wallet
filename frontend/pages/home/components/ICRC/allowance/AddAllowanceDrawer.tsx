import { t } from "i18next";
import { Drawer } from "@components/drawer";
import useAllowanceDrawer from "@pages/home/hooks/useAllowanceDrawer";
import CreateForm from "./CreateForm";

export default function AddAllowanceDrawer() {
  const { isCreateAllowance, onCloseCreateAllowanceDrawer, isLoading } = useAllowanceDrawer();

  return (
    <Drawer
      isDrawerOpen={isCreateAllowance}
      onClose={onCloseCreateAllowanceDrawer}
      title={`${t("allowance.add.allowance")}`}
      enableClose={!isLoading}
    >
      {!isCreateAllowance ? null : <CreateForm />}
    </Drawer>
  );
}
