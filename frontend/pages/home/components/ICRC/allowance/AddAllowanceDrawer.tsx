import { Drawer } from "@components/drawer";
import { t } from "i18next";

export default function AddAllowanceDrawer() {
  // TODO: access to the state to open the drawer
  const isDrawerOpen = false;
  const onClose = () => {};

  return (
    <Drawer
        isDrawerOpen={isDrawerOpen}
        onClose={onClose}
        title={`${t("allowance.add.allowance")}`}>
      {/* {!isDrawerOpen ? null : <p>form add allowance</p>} */}
    </Drawer>
  );
}
