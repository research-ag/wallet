import { BasicDrawer } from "@components/drawer";
import useAllowanceDrawer from "@pages/allowances/hooks/useAllowanceDrawer";
import { useTranslation } from "react-i18next";
import UpdateForm from "./UpdateForm";

export default function UpdateAllowanceDrawer() {
  const { t } = useTranslation();
  const { isUpdateAllowance, onCloseUpdateAllowanceDrawer, isLoading } = useAllowanceDrawer();

  return (
    <BasicDrawer
      isDrawerOpen={isUpdateAllowance}
      onClose={onCloseUpdateAllowanceDrawer}
      title={t("allowance.edit.allowance")}
      enableClose={!isLoading}
    >
      {isUpdateAllowance ? <UpdateForm /> : <></>}
    </BasicDrawer>
  );
}
