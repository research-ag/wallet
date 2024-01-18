import SenderType from "./SenderType";
import SenderSubAccount from "./SenderSubAccount";
import { SenderOption } from "@/@types/transactions";
import { useEffect, useState } from "react";
import SenderAllowanceContact from "./SenderAllowanceContact";
import { useAppSelector } from "@redux/Store";
import { setSenderAssetAction, setSenderSubAccountAction } from "@redux/transaction/TransactionActions";

export default function SenderItem() {
  const [senderOption, setSenderOption] = useState<SenderOption>(SenderOption.own);

  return (
    <SenderInitializer>
      <div className="w-full mt-4 rounded-md bg-ToBoxColor">
        <div className="w-full py-2 border-b border-BorderColor">
          <SenderType senderOption={senderOption} setSenderOption={setSenderOption} />
        </div>
        <div className="p-4">
          {senderOption === SenderOption.own && <SenderSubAccount />}
          {senderOption === SenderOption.allowance && <SenderAllowanceContact />}
        </div>
      </div>
    </SenderInitializer>
  );
}

function SenderInitializer({ children }: { children: JSX.Element }) {
  const { selectedAsset, selectedAccount } = useAppSelector((state) => state.asset);

  useEffect(() => {
    if (selectedAsset) {
      setSenderAssetAction(selectedAsset);
    }
  }, [selectedAsset]);

  useEffect(() => {
    if (selectedAccount) {
      setSenderSubAccountAction(selectedAccount);
    }
  }, [selectedAccount]);

  return children;
}
