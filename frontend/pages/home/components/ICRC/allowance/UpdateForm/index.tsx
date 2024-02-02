import { useUpdateAllowance } from "@pages/home/hooks/useAllowanceUpdate";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import FixedFieldsFormItem from "./FixedFieldsFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import { Button } from "@components/button";
import AmountFormItem from "./AmountFormItem";
import { validationMessage } from "@pages/home/validators/allowance";

export default function UpdateForm() {
  const { t } = useTranslation();
  const { allowance, setAllowanceState, updateAllowance, isPending, validationErrors } = useUpdateAllowance();

  const errorMessage = useMemo(() => {
    let errorMessage = "";

    if (validationErrors[0]?.message === validationMessage.lowBalance) errorMessage = validationErrors[0]?.message;

    if (validationErrors[0]?.message === validationMessage.invalidAmount) errorMessage = validationErrors[0].message;
    if (validationErrors[0]?.message === validationMessage.expiredDate) errorMessage = validationErrors[0].message;

    return errorMessage;
  }, [validationErrors]);

  return (
    <form className="flex flex-col text-left">
      <FixedFieldsFormItem allowance={allowance} />

      <AmountFormItem
        allowance={allowance}
        isLoading={isPending}
        errors={validationErrors}
        setAllowanceState={setAllowanceState}
      />

      <ExpirationFormItem allowance={allowance} setAllowanceState={setAllowanceState} isLoading={isPending} />

      <div className={`flex items-center mt-4 ${errorMessage.length > 0 ? "justify-between" : "justify-end"}`}>
        {errorMessage.length > 0 && <p className="text-TextErrorColor text-md">{errorMessage}</p>}

        <Button
          onClick={(e) => {
            e.preventDefault();
            updateAllowance();
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
}
