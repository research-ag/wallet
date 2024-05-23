import useCreateAllowance from "@pages/allowances/hooks/useCreateAllowance";
import { useAppSelector } from "@redux/Store";
import AssetFormItem from "./AssetFormItem";
import SubAccountFormItem from "./SubAccountFormItem";
import SpenderFormItem from "./SpenderFormItem";
import AmountFormItem from "./AmountFormItem";
import ExpirationFormItem from "./ExpirationFormItem";
import { AllowanceValidationErrorsEnum } from "@/@types/allowance";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@components/button";
import { validatePrincipal } from "@/common/utils/definityIdentity";
import {
  removeAllowanceErrorAction,
  setAllowanceErrorAction,
  setFullAllowanceErrorsAction,
} from "@redux/allowance/AllowanceActions";
import { db } from "@/database/db";
import { LoadingLoader } from "@components/loader";
import { refreshAllowance } from "@pages/allowances/helpers/refresh";
import { getDuplicatedAllowance } from "@pages/allowances/helpers/validators";
import { getAllowanceDetails } from "@/common/libs/icrc";
import { isHexadecimalValid } from "@pages/home/helpers/checkers";
import logger from "@/common/utils/logger";

export default function CreateForm() {
  const { t } = useTranslation();
  const { contacts } = useAppSelector((state) => state.contacts);
  const { isAppDataFreshing } = useAppSelector((state) => state.common);
  const { assets } = useAppSelector((state) => state.asset.list);
  const { selectedAsset } = useAppSelector((state) => state.asset.helper);
  const { allowances } = useAppSelector((state) => state.allowance.list);
  const { errors } = useAppSelector((state) => state.allowance);
  const { allowance, setAllowanceState, createAllowance, isPending, isLoading, setLoading } = useCreateAllowance();
  const { userPrincipal } = useAppSelector((state) => state.auth);

  return (
    <form className="relative flex flex-col px-8 overflow-y-auto text-left">
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
            disabled={isPending || isLoading || (allowances.length === 0 && isAppDataFreshing)}
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

      // INFO: this validation guarantee all the fields need for icrc2_allowance where set, if not show user feedback
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
        id: db().generateAllowancePrimaryKey(allowance),
      };

      const duplicated = await getDuplicatedAllowance(newAllowance);

      if (duplicated?.id) {
        // INFO: exist in ledger and local db
        const isExpirationSame = newAllowance.expiration === duplicated.expiration;
        const isAmountSame = newAllowance.amount === duplicated.amount;

        if (!isExpirationSame || !isAmountSame) {
          refreshAllowance(newAllowance);
        }
      }

      if (!duplicated?.id && newAllowance.amount !== "0") {
        // INFO: exist in ledger but not in local db
        const updatedAllowances = [...allowances, newAllowance];

        await db().updateAllowances(
          updatedAllowances.map((currentAllowance) => ({
            ...currentAllowance,
            id: db().generateAllowancePrimaryKey(currentAllowance),
          })),
          { sync: true },
        );
      }

      setAllowanceState({ ...newAllowance, amount: newAllowance.amount.replace(/,/g, "") });
    } catch (error) {
      logger.debug(error);
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
