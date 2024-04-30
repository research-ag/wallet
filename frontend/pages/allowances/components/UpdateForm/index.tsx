import { useUpdateAllowance } from "@pages/allowances/hooks/useUpdateAllowance";
import { useTranslation } from "react-i18next";
import FixedFieldsFormItem from "./FixedFieldsFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import { BasicButton } from "@components/button";
import AmountFormItem from "./AmountFormItem";
import { useAppSelector } from "@redux/Store";
import { AllowanceValidationErrorsEnum } from "@/@types/allowance";

export default function UpdateForm() {
  const { t } = useTranslation();
  const { errors } = useAppSelector((state) => state.allowance);
  const { allowance, setAllowanceState, updateAllowance, isPending } = useUpdateAllowance();

  return (
    <form className="flex flex-col px-8 overflow-y-auto text-left">
      <FixedFieldsFormItem allowance={allowance} />

      <AmountFormItem allowance={allowance} isLoading={isPending} setAllowanceState={setAllowanceState} />

      <ExpirationFormItem allowance={allowance} setAllowanceState={setAllowanceState} isLoading={isPending} />

      <div className={`flex items-center mt-4 ${getErrorMessage() ? "justify-between" : "justify-end"}`}>
        {getErrorMessage() && <p className="text-TextErrorColor text-md">{getErrorMessage()}</p>}

        <BasicButton
          onClick={(e) => {
            e.preventDefault();
            updateAllowance();
          }}
          className="w-1/4"
          disabled={isPending}
          isLoading={isPending}
        >
          {t("save")}
        </BasicButton>
      </div>
    </form>
  );

  function getErrorMessage() {
    const filteredErrors = errors.filter(
      (error) =>
        error === AllowanceValidationErrorsEnum.Values["error.not.enough.balance"] ||
        error === AllowanceValidationErrorsEnum.Values["error.before.present.expiration"],
    );
    if (filteredErrors.length > 0) return t(filteredErrors[0]);
    return "";
  }
}
