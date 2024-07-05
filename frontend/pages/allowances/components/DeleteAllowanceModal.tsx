import { AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { middleTruncation } from "@/common/utils/strings";
import { ReactComponent as AlertIcon } from "@assets/svg/files/alert-icon.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { LoadingLoader } from "@components/loader";
import { BasicModal } from "@components/modal";
import { BasicButton } from "@components/button";
import useDeleteAllowance from "@pages/allowances/hooks/useDeleteAllowance";
import { useAppSelector } from "@redux/Store";
import {
  setFullAllowanceErrorsAction,
  setIsDeleteAllowanceAction,
  setSelectedAllowanceAction,
} from "@redux/allowance/AllowanceActions";
import { initialAllowanceState } from "@redux/allowance/AllowanceReducer";
import { clsx } from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function DeleteAllowanceModal() {
  const { t } = useTranslation();
  const { isDeleteAllowance, selectedAllowance, errors } = useAppSelector((state) => state.allowance);
  const { contacts } = useAppSelector((state) => state.contacts);
  const { deleteAllowance, isPending } = useDeleteAllowance();

  const spenderName = useMemo(() => {
    const contact = contacts.find((contact) => contact.principal === selectedAllowance?.spender);
    return contact?.name ? contact.name : undefined;
  }, [selectedAllowance, contacts]);

  return (
    <BasicModal open={isDeleteAllowance} width="w-[26rem]">
      <div className="flex items-center justify-between w-full">
        <AlertIcon className="fill-slate-color-error" />
        <CloseIcon
          onClick={() => onCancel()}
          className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
        />
      </div>
      <div className="flex items-center justify-center w-full mt-4">
        <div>
          <p className={textStyles}>
            {t("allowance.sure.remove")}{" "}
            <span className="font-bold">{spenderName || middleTruncation(selectedAllowance.spender, 4, 4)}</span>?
          </p>
          <p className={textStyles}>{t("allowance.permanently.deleted")}</p>
        </div>
      </div>
      <div className="flex items-center justify-end w-full mt-4">
        <p className="mr-4 text-sm text-slate-color-error">{getErrorMessage()}</p>
        {isPending && <LoadingLoader className="mr-4" />}
        <BasicButton
          onClick={handleDelete}
          className="w-[4rem] h-[2rem] text-secondary-color-1-light dark:text-white"
          disabled={isPending}
        >
          {t("yes")}
        </BasicButton>
      </div>
    </BasicModal>
  );

  async function handleDelete() {
    await deleteAllowance();
  }

  function onCancel() {
    setSelectedAllowanceAction(initialAllowanceState);
    setFullAllowanceErrorsAction([]);
    setIsDeleteAllowanceAction(false);
  }
  function getErrorMessage() {
    const filteredErrors = errors.filter(
      (error) => error === AllowanceValidationErrorsEnum.Values["error.not.enough.balance"],
    );
    if (filteredErrors.length > 0) return t(filteredErrors[0]);
    return undefined;
  }
}

const textStyles = clsx("text-gray-color-3 dark:text-gray-color-7");
