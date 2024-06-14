import { createContext, useContext, useState } from "react";

// ----------------- TYPES -----------------

export enum TransferStatus {
  SENDING = "sending",
  DONE = "done",
  ERROR = "error",
  NONE = "none",
}

export interface TransferStatusState {
  status: TransferStatus;
  setStatus: (status: TransferStatus) => void;
}

// --------------- CONTEXT ---------------

export const TransferStatusContext = createContext<TransferStatusState | null>(null);

export default function TransferStatusProvider({ children }: { children: JSX.Element }) {
  const [status, setStatus] = useState<TransferStatus>(TransferStatus.NONE);

  const value = { status, setStatus };

  return <TransferStatusContext.Provider value={value}>{children}</TransferStatusContext.Provider>;
}

// --------------- HOOK ---------------

export function useTransferStatus() {
  const context = useContext(TransferStatusContext);
  if (!context) {
    throw new Error("useTransferStatus must be used within a TransferStatusProvider");
  }
  return context;
}
