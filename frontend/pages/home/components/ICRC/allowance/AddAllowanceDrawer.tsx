import { Drawer } from "@components/drawer";
import useAllowanceDrawer from "@pages/home/hooks/useAllowanceDrawer";
import { t } from "i18next";

export default function AddAllowanceDrawer() {
  const {isCreateAllowance, onCloseCreateAllowanceDrawer} = useAllowanceDrawer();
  return (
    <Drawer
        isDrawerOpen={isCreateAllowance}
        onClose={onCloseCreateAllowanceDrawer}
        title={`${t("allowance.add.allowance")}`}>
      {/* {!isDrawerOpen ? null : <p>form add allowance</p>} */}
      <p>Hello</p>
    </Drawer>
  );
}
