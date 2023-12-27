import { useCreateAllowance } from "@pages/home/hooks/useAllowanceMutation";
import { useAppSelector } from "@redux/Store";
import { Drawer } from "@components/core/drawer";
import AssetFormItem from "./AssetFormItem";
import SubAccountFormItem from "./SubAccountFormItem";
import SpenderFormItem from "./SpenderFormItem";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import Button from "@components/core/buttons/Button";

interface IAllowanceDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
}

export default function AddAllowanceDrawer(props: IAllowanceDrawerProps) {
  const { isDrawerOpen, onClose } = props;
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets, selectedAsset } = useAppSelector((state) => state.asset);
  const { allowance, setAllowanceState, createAllowance, isPending, isPrincipalValid } = useCreateAllowance();

  return (
    <Drawer isDrawerOpen={isDrawerOpen} onClose={onClose} title="Add Allowance">
      <form className="flex flex-col text-left">
        <AssetFormItem
          allowance={allowance}
          assets={assets}
          selectedAsset={selectedAsset}
          setAllowanceState={setAllowanceState}
          isLoading={isPending}
        />

        <SubAccountFormItem
          allowance={allowance}
          selectedAsset={selectedAsset}
          setAllowanceState={setAllowanceState}
          isLoading={isPending}
        />

        <SpenderFormItem
          allowance={allowance}
          contacts={contacts}
          setAllowanceState={setAllowanceState}
          isLoading={isPending}
          isPrincipalValid={isPrincipalValid}
        />

        <AmountFormItem
          allowance={allowance}
          selectedAsset={selectedAsset}
          setAllowanceState={setAllowanceState}
          isLoading={isPending}
        />

        <ExpirationFormItem allowance={allowance} setAllowanceState={setAllowanceState} isLoading={isPending} />

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
    </Drawer>
  );
}
