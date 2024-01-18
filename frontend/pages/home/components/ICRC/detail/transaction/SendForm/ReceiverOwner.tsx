//
import { SendingStatus } from "@/const";
import { clsx } from "clsx";
import { Asset, SubAccount } from "@redux/models/AccountModels";

interface SendOwnAccountProps {
  selectedAccount: SubAccount | undefined;
  setSelectedAccount(value: SubAccount | undefined): void;
  selectedAsset: Asset | undefined;
  receiver: any;
  setReciver(value: any): void;
  contactToSend: any;
  assetDropOpen: boolean;
  setAssetDropOpen(value: boolean): void;
  showModal(value: boolean): void;
  amount: string;
  setDrawerOpen(value: boolean): void;
  setSendingStatus(value: SendingStatus): void;
  setAmount(value: string): void;
  setAmountBI(value: bigint): void;
  setNewAccount(value: string): void;
  setContactToSend(value: any): void;
}

export default function ReceiverOwner() {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full text-lg text-PrimaryTextColorLight dark:text-PrimaryTextColor">
      
    </div>
  );
}

// Tailwind CSS constants
const sendBox = clsx(
  "flex",
  "flex-row",
  "w-full",
  "justify-between",
  "items-start",
  "rounded",
  "border",
  "p-3",
  "mb-4",
);

const accountInfo = clsx("flex", "flex-col", "justify-start", "items-start", "w-full", "pl-2", "pr-2");
