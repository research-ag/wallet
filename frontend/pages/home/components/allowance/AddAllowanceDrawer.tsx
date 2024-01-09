import { useAppSelector } from "@redux/Store";
import { Drawer } from "@components/drawer";
import AssetFormItem from "./AssetFormItem";
import SubAccountFormItem from "./SubAccountFormItem";
import SpenderFormItem from "./SpenderFormItem";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import Button from "@components/buttons/Button";
import { useCreateAllowance } from "@pages/home/hooks/useCreateAllowance";
import { useMemo } from "react";
import { validationMessage } from "@/helpers/schemas/allowance";
import { useTranslation } from "react-i18next";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

function AddForm() {
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets, selectedAsset } = useAppSelector((state) => state.asset);
  const { allowance, setAllowanceState, createAllowance, isPending, isPrincipalValid, validationErrors } =
    useCreateAllowance();

  const errorMessage = useMemo(() => {
    let errorMessage = "";

    if (validationErrors[0]?.message === validationMessage.lowBalance) errorMessage = validationErrors[0]?.message;

    if (validationErrors[0]?.message === validationMessage.invalidAmount) errorMessage = validationErrors[0].message;
    if (validationErrors[0]?.message === validationMessage.expiredDate) errorMessage = validationErrors[0].message;

    return errorMessage;
  }, [validationErrors]);

  return (
    <form className="flex flex-col text-left">
      <AssetFormItem
        allowance={allowance}
        assets={assets}
        selectedAsset={selectedAsset}
        setAllowanceState={setAllowanceState}
        isLoading={isPending}
        errors={validationErrors}
      />

      <SubAccountFormItem
        allowance={allowance}
        selectedAsset={selectedAsset}
        setAllowanceState={setAllowanceState}
        isLoading={isPending}
        errors={validationErrors}
      />

      <SpenderFormItem
        allowance={allowance}
        contacts={contacts}
        setAllowanceState={setAllowanceState}
        isLoading={isPending}
        isPrincipalValid={isPrincipalValid}
        errors={validationErrors}
      />

      <AmountFormItem
        allowance={allowance}
        selectedAsset={selectedAsset}
        setAllowanceState={setAllowanceState}
        isLoading={isPending}
        errors={validationErrors}
      />

      <ExpirationFormItem allowance={allowance} setAllowanceState={setAllowanceState} isLoading={isPending} />

      <div className={`flex items-center mt-4 ${errorMessage.length > 0 ? "justify-between" : "justify-end"}`}>
        {errorMessage.length > 0 && <p className="text-TextErrorColor text-md">{errorMessage}</p>}

        <Button
          onClick={(e) => {
            e.preventDefault();
            createAllowance();
          }}
          className="w-1/4"
          disabled={isPending}
          isLoading={isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}

export default function AddAllowanceDrawer(props: IAllowanceDrawerProps) {
  const { t } = useTranslation();
  const { isDrawerOpen, onClose } = props;

  return (
    <Drawer isDrawerOpen={isDrawerOpen} onClose={onClose} title={`${t("allowance.add.allowance")}`}>
      {!isDrawerOpen ? null : <AddForm />}
    </Drawer>
  );
}
