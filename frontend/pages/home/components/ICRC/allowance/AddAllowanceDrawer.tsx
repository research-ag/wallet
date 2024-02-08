import { t } from "i18next";
import { Drawer } from "@components/drawer";
import useAllowanceDrawer from "@pages/home/hooks/useAllowanceDrawer";
import CreateForm from "./CreateForm";
import { useAppSelector } from "@redux/Store";

export default function AddAllowanceDrawer() {
  const { isCreateAllowance, onCloseCreateAllowanceDrawer } = useAllowanceDrawer();
  const { assetLoading } = useAppSelector((state) => state.asset);
  console.log("assetLoading", assetLoading);

  return (
    <Drawer
      isDrawerOpen={isCreateAllowance}
      onClose={onCloseCreateAllowanceDrawer}
      title={`${t("allowance.add.allowance")}`}
    >
      {!isCreateAllowance ? null : <CreateForm />}
    </Drawer>
  );
}
