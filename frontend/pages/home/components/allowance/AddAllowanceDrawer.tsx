import { useAppSelector } from "@redux/Store";
import { Drawer } from "@components/drawer";
import AssetFormItem from "./AssetFormItem";
import SubAccountFormItem from "./SubAccountFormItem";
import SpenderFormItem from "./SpenderFormItem";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import Button from "@components/buttons/Button";
import { useCreateAllowance } from "@pages/home/hooks/useCreateAllowance";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

function AddForm() {
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets, selectedAsset } = useAppSelector((state) => state.asset);
  const { allowance, setAllowanceState, createAllowance, isPending, isPrincipalValid, validationErrors } =
    useCreateAllowance();

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

      <ExpirationFormItem
        allowance={allowance}
        setAllowanceState={setAllowanceState}
        isLoading={isPending}
        errors={validationErrors}
      />

      <div className="flex justify-end mt-4">
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
  const { isDrawerOpen, onClose } = props;

  return (
    <Drawer isDrawerOpen={isDrawerOpen} onClose={onClose} title="Add Allowance">
      {!isDrawerOpen ? null : <AddForm />}
    </Drawer>
  );
}
