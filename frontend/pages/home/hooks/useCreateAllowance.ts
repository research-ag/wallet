import { TAllowance } from "@/@types/allowance";
import { TErrorValidation } from "@/@types/common";
import { useAppSelector } from "@redux/Store";
import { useMemo, useState } from "react";

export const initialAllowanceState: TAllowance = {
  asset: {
    logo: "",
    name: "",
    symbol: "",
    subAccounts: [],
    address: "",
    decimal: "",
    sort_index: 0,
    index: "",
    tokenName: "",
    tokenSymbol: "",
    shortDecimal: "",
  },
  subAccount: {
    name: "",
    sub_account_id: "",
    address: "",
    amount: "",
    currency_amount: "",
    transaction_fee: "",
    decimal: 0,
    symbol: "",
  },
  spender: {
    name: "",
    accountIdentifier: "",
    principal: "",
  },
  amount: "",
  expiration: "",
  noExpire: true,
};

export default function useCreateAllowance() {
  const { selectedAsset, selectedAccount } = useAppSelector(({ asset }) => asset);
  const [validationErrors, setErrors] = useState<TErrorValidation[]>([]);
  const [isPrincipalValid, setIsPrincipalValid] = useState(true);

  const initial = useMemo(() => {
    return {
      ...initialAllowanceState,
      asset: selectedAsset,
      subAccount: selectedAccount,
    };
  }, [selectedAsset]) as TAllowance;

  return {};
}
