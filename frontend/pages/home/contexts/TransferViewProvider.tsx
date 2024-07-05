import { createContext, useContext, useState } from "react";

// ----------------- TYPES -----------------

export enum TransferView {
  SEND_FORM,
  CONFIRM_DETAIL,
  SENDER_QR_SCANNER,
  RECEIVER_QR_SCANNER,
}

type TransferViewState = {
  view: TransferView;
  setView: (view: TransferView) => void;
};

// --------------- CONTEXT ---------------

export const TransferViewContext = createContext<TransferViewState | null>(null);

export default function TransferViewProvider({ children }: { children: JSX.Element }) {
  const [view, setView] = useState<TransferView>(TransferView.SEND_FORM);
  const value = { view, setView };
  return <TransferViewContext.Provider value={value}>{children}</TransferViewContext.Provider>;
}

// --------------- HOOK ---------------

export function useTransferView() {
  const context = useContext(TransferViewContext);
  if (!context) {
    throw new Error("useTransferView must be used within a TransferViewProvider");
  }
  return context;
}
