import useCreateAllowance from "@pages/home/hooks/useCreateAllowance";
import { useAppSelector } from "@redux/Store";
import AssetFormItem from "./AssetFormItem";
import SubAccountFormItem from "./SubAccountFormItem";
import SpenderFormItem from "./SpenderFormItem";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import { AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/button";
import { getAllowanceDetails } from "@pages/home/helpers/icrc/";
import { validatePrincipal } from "@/utils/identity";
import { isHexadecimalValid } from "@/utils/checkers";
import {
  removeAllowanceErrorAction,
  setAllowanceErrorAction,
  setFullAllowanceErrorsAction,
} from "@redux/allowance/AllowanceActions";
import { getDuplicatedAllowance } from "@pages/home/validators/allowance";
import { db } from "@/database/db";
import { LoadingLoader } from "@components/loader";
import { refreshAllowance } from "@pages/home/helpers/refreshAllowance";

export default function CreateForm() {
  const { t } = useTranslation();
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets, selectedAsset, assetLoading } = useAppSelector((state) => state.asset);
  const { errors, allowances } = useAppSelector((state) => state.allowance);
  const { allowance, setAllowanceState, createAllowance, isPending, isLoading, setLoading } = useCreateAllowance();
  const { userPrincipal } = useAppSelector((state) => state.auth);

  return (
    <form className="flex flex-col px-8 overflow-y-auto text-left">
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
        {(isLoading || isPending) && <LoadingLoader className="mr-2" />}
        <div className="flex">
          <CustomButton intent="success" className="mr-4" onClick={onCheckAllowance} disabled={isPending || isLoading}>
            {t("test")}
          </CustomButton>
          <CustomButton
            onClick={onSaveAllowance}
            disabled={isPending || isLoading || (allowances.length === 0 && assetLoading)}
          >
            {t("submit")}
          </CustomButton>
        </div>
      </div>
    </form>
  );

  async function onCheckAllowance(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    try {
      setLoading(true);
      event.preventDefault();
      setFullAllowanceErrorsAction([]);

      // // INFO: this validation guarantee all the fields need for icrc2_allowance where set, if not show user feedback
      if (!allowance.asset.address || !allowance.asset.decimal)
        return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]);
      removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.asset"]);

      if (!isHexadecimalValid(allowance?.subAccountId))
        return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]);
      removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.subaccount"]);

      if (!validatePrincipal(allowance?.spender))
        return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"]);
      removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.invalid.spender.principal"]);

      if (allowance?.spender === userPrincipal.toText())
        return setAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.self.allowance"]);
      removeAllowanceErrorAction(AllowanceValidationErrorsEnum.Values["error.self.allowance"]);

      const response = await getAllowanceDetails({
        assetAddress: allowance.asset.address,
        assetDecimal: allowance.asset.decimal,
        spenderSubaccount: allowance.subAccountId,
        spenderPrincipal: allowance.spender,
      });

      const newAllowance = {
        ...allowance,
        amount: response?.allowance || "0",
        expiration: response?.expires_at || "",
      };

      const duplicated = await getDuplicatedAllowance(newAllowance);

      if (duplicated) {
        const isExpirationSame = newAllowance.expiration === duplicated.expiration;
        const isAmountSame = newAllowance.amount === duplicated.amount;

        if (!isExpirationSame || !isAmountSame) {
          refreshAllowance(newAllowance);
        }
      }

      if (!duplicated && newAllowance.amount !== "0") {
        const updatedAllowances = [...allowances, newAllowance];

        await db().updateAllowances(
          updatedAllowances.map((currentAllowance) => ({
            ...currentAllowance,
            id: db().generateAllowancePrimaryKey(currentAllowance),
          })),
        );
      }

      setAllowanceState(newAllowance);
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
