import { BasicModal } from "@components/modal";
import { SubAccountMutationAction } from "@redux/assets/AssetReducer";
import { useAppSelector } from "@redux/Store";

export default function AddSubAccountModal() {
  const { subAccountAction } = useAppSelector((state) => state.asset.mutation)
  const isModalOpen = subAccountAction !== SubAccountMutationAction.NONE && subAccountAction !== SubAccountMutationAction.DELETE;

  return (
    <BasicModal
      width="w-[18rem]"
      padding="py-5 px-4"
      border="border border-BorderColorTwoLight dark:border-BorderColorTwo"
      open={isModalOpen}
    >
      <p>Modal</p>
    </BasicModal>
  );
};
