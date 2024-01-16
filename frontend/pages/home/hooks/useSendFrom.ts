import { useAppSelector } from "@redux/Store";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { useEffect, useState } from "react";

export interface SenderInitialState {
  asset: Asset;
  subAccount: SubAccount;
}

const initialState = {} as SenderInitialState;

export default function useSendFrom() {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);
  const [sender, setSender] = useState<SenderInitialState>(initialState);

  useEffect(() => {
    if (selectedAsset) {
      setSender((prev) => ({ ...prev, asset: selectedAsset }));
    }
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAccount) {
      setSender((prev) => ({ ...prev, subAccount: selectedAccount }));
    }
  }, [selectedAccount]);

  console.log(sender);

  return { sender, setSender };
}
