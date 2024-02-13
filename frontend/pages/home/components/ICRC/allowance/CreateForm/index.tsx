import useCreateAllowance from "@pages/home/hooks/useCreateAllowance";
import { useAppSelector } from "@redux/Store";
import AssetFormItem from "./AssetFormItem";
import SubAccountFormItem from "./SubAccountFormItem";
import SpenderFormItem from "./SpenderFormItem";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import { AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/Button";
import { getAllowanceDetails } from "@pages/home/helpers/icrc";
import { validatePrincipal } from "@/utils/identity";
import { isHexadecimalValid } from "@/utils/checkers";

export default function CreateForm() {
  const { t } = useTranslation();
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets, selectedAsset } = useAppSelector((state) => state.asset);
  const { errors } = useAppSelector((state) => state.allowance);
  const { allowance, setAllowanceState, createAllowance, isPending, isLoading, setLoading } = useCreateAllowance();

  return (
    <form className="flex flex-col text-left">
      <AssetFormItem
        allowance={allowance}
        assets={assets}
        selectedAsset={selectedAsset}
        setAllowanceState={setAllowanceState}
        isLoading={isPending || isLoading}
      />

      <SubAccountFormItem
        allowance={allowance}
        selectedAsset={selectedAsset}
        setAllowanceState={setAllowanceState}
        isLoading={isPending || isLoading}
      />

      <SpenderFormItem
        allowance={allowance}
        contacts={contacts}
        setAllowanceState={setAllowanceState}
        isLoading={isPending || isLoading}
      />

      <AmountFormItem
        allowance={allowance}
        selectedAsset={selectedAsset}
        setAllowanceState={setAllowanceState}
        isLoading={isPending || isLoading}
      />

      <ExpirationFormItem
        allowance={allowance}
        setAllowanceState={setAllowanceState}
        isLoading={isPending || isLoading}
      />

      <div className={`flex items-center mt-4 ${getErrorMessage() ? "justify-between" : "justify-end"}`}>
        {getErrorMessage() && <p className="mr-4 text-TextErrorColor text-md">{getErrorMessage()}</p>}
        <div className="flex">
          <CustomButton intent="success" className="mr-4" onClick={onCheckAllowance} disabled={isPending || isLoading}>
            {t("test")}
          </CustomButton>
          <CustomButton onClick={onSaveAllowance} disabled={isPending || isLoading}>
            {t("save")}
          </CustomButton>
        </div>
      </div>
    </form>
  );

  async function onCheckAllowance(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    try {
      setLoading(true);
      event.preventDefault();
      if (!allowance.asset.address) return;
      if (!allowance.asset.decimal) return;
      if (!allowance.subAccount.sub_account_id) return;
      if (!allowance.spender.principal) return;
      if (!validatePrincipal(allowance.spender.principal)) return;
      if (!isHexadecimalValid(allowance.subAccount.sub_account_id)) return;

      const response = await getAllowanceDetails({
        assetAddress: allowance.asset.address,
        assetDecimal: allowance.asset.decimal,
        spenderSubaccount: allowance.subAccount.sub_account_id,
        spenderPrincipal: allowance.spender.principal,
      });

      setAllowanceState({
        ...allowance,
        amount: response?.allowance,
        expiration: response?.expires_at,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function onSaveAllowance(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    createAllowance();
  }

  function getErrorMessage() {
    const filteredErrors = errors.filter(
      (error) =>
        error === AllowanceValidationErrorsEnum.Values["error.not.enough.balance"] ||
        error === AllowanceValidationErrorsEnum.Values["error.before.present.expiration"] ||
        error === AllowanceValidationErrorsEnum.Values["error.allowance.duplicated"] ||
        error === AllowanceValidationErrorsEnum.Values["error.self.allowance"],
    );
    if (filteredErrors.length > 0) return t(filteredErrors[0]);
    return "";
  }
}
