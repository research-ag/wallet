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
import {
  removeAllowanceErrorAction,
  setAllowanceErrorAction,
  setAllowancesAction,
  setFullAllowanceErrorsAction,
} from "@redux/allowance/AllowanceActions";
import { getDuplicatedAllowance } from "@pages/home/validators/allowance";
import dayjs from "dayjs";
import { getAllowancesFromStorage, replaceAllowancesToStorage } from "@pages/home/services/allowance";
import LoadingLoader from "@components/Loader";

export default function CreateForm() {
  const { t } = useTranslation();
  const { contacts } = useAppSelector((state) => state.contacts);
  const { assets, selectedAsset } = useAppSelector((state) => state.asset);
  const { errors } = useAppSelector((state) => state.allowance);
  const { allowance, setAllowanceState, createAllowance, isPending, isLoading, setLoading } = useCreateAllowance();
  const { userPrincipal } = useAppSelector((state) => state.auth);

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
        {(isLoading || isPending) && <LoadingLoader className="mr-2" />}
        <div className="flex">
          <CustomButton intent="success" className="mr-4" onClick={onCheckAllowance} disabled={isPending || isLoading}>
            {t("test")}
          </CustomButton>
          <CustomButton onClick={onSaveAllowance} disabled={isPending || isLoading}>
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

      console.log("validated: asset-address, asset-decimal, sub-acc, spender");

      const response = await getAllowanceDetails({
        assetAddress: allowance.asset.address,
        assetDecimal: allowance.asset.decimal,
        spenderSubaccount: allowance.subAccountId,
        spenderPrincipal: allowance.spender,
      });

      console.log("ledger allowance: ", response);

      const newAllowance = {
        ...allowance,
        amount: response?.allowance || "0",
        expiration: response?.expires_at || "",
      };

      console.log("New allowance: ", newAllowance);

      const duplicated = getDuplicatedAllowance(newAllowance);
      console.log("Duplicated allowance: ", duplicated);

      const allowances = getAllowancesFromStorage();
      if (duplicated) {
        const isExpirationSame = newAllowance.expiration === duplicated.expiration;
        const isAmountSame = newAllowance.amount === duplicated.amount;
        console.log("Is expiration differ: ", !isExpirationSame);
        console.log("Is  amount differ: ", !isAmountSame);

        if (!isExpirationSame || !isAmountSame) {
          const filteredAllowances = allowances.filter((allowance) =>
            Boolean(
              allowance.subAccountId !== newAllowance.subAccountId &&
                allowance.spender !== newAllowance.spender &&
                allowance.asset.tokenSymbol !== newAllowance.asset.tokenSymbol,
            ),
          );
          console.log("Then remove duplicated from allowances", filteredAllowances);
          const updatedAllowances = [...filteredAllowances, newAllowance];
          console.log("Updated allowances with newAllowance: ", updatedAllowances);
          setAllowancesAction(updatedAllowances);
          replaceAllowancesToStorage(updatedAllowances);
        }
      }

      if (!duplicated && newAllowance.amount !== "0") {
        console.log("no duplicated but exist allowance");
        const updatedAllowances = [...allowances, newAllowance];
        setAllowancesAction(updatedAllowances);
        replaceAllowancesToStorage(updatedAllowances);
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
