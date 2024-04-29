import { t } from "i18next";
import { BasicDrawer } from "@components/drawer";
import CreateForm from "./CreateForm";
import useAllowanceDrawer from "@pages/allowances/hooks/useAllowanceDrawer";

export default function AddAllowanceDrawer() {
  const { isCreateAllowance, onCloseCreateAllowanceDrawer, isLoading } = useAllowanceDrawer();

  return (
    <BasicDrawer
      isDrawerOpen={isCreateAllowance}
      onClose={onCloseCreateAllowanceDrawer}
      title={`${t("allowance.add.allowance")}`}
      enableClose={!isLoading}
    >
      {!isCreateAllowance ? null : <CreateForm />}
    </BasicDrawer>
  );
}
