import useCreateAllowance from "@pages/home/hooks/useCreateAllowance";
import { useAppSelector } from "@redux/Store";
import AssetFormItem from "./AssetFormItem";
import SubAccountFormItem from "./SubAccountFormItem";
import SpenderFormItem from "./SpenderFormItem";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import { Button } from "@components/button";
import { AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { useTranslation } from "react-i18next";

export default function CreateForm() {
  const { t } = useTranslation();
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets, selectedAsset } = useAppSelector((state) => state.asset);
  const { errors } = useAppSelector((state) => state.allowance);
  const { allowance, setAllowanceState, createAllowance, isPending } = useCreateAllowance();

  return (
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
      />

      <AmountFormItem
        allowance={allowance}
        selectedAsset={selectedAsset}
        setAllowanceState={setAllowanceState}
        isLoading={isPending}
      />

      <ExpirationFormItem allowance={allowance} setAllowanceState={setAllowanceState} isLoading={isPending} />

      <div className={`flex items-center mt-4 ${getErrorMessage() ? "justify-between" : "justify-end"}`}>
        {getErrorMessage() && <p className="text-TextErrorColor text-md">{getErrorMessage()}</p>}

        <Button
          onClick={(e) => {
            e.preventDefault();
            createAllowance();
          }}
          className="w-1/4"
          disabled={isPending}
          isLoading={isPending}
        >
          {t("save")}
        </Button>
      </div>
    </form>
  );

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
