import Button from "@components/buttons/Button";
import { useMemo } from "react";
import { useUpdateAllowance } from "@pages/home/hooks/useUpdateAllowance";
import { validationMessage } from "@/helpers/schemas/allowance";
import EditFormFixedFields from "./EditFormFixedFields";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import { useTranslation } from "react-i18next";

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
      <EditFormFixedFields allowance={allowance} />

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
