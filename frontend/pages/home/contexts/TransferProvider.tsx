import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

// --------------- TYPES ---------------

type TransferProviderProps = {
  children: JSX.Element;
};

export enum TransferFromTypeEnum {
  Own = "OWN",
  Allowance = "ALLOWANCES",
  Service = "SERVICES",
}

export enum TransferToTypeEnum {
  Own = "OWN",
  ThirdParty = "TIRD_PARTY",
}

export type TransferStateType = {
  tokenSymbol: string;

  fromType: TransferFromTypeEnum;
  fromPrincipal: string;
  fromSubAccount: string;

  toType: TransferToTypeEnum;
  toPrincipal: string;
  toSubAccount: string;
};

export type TransferProviderType = {
  transferState: TransferStateType;
  setTransferState: Dispatch<SetStateAction<TransferStateType>>;
};

// --------------- CONTEXT ---------------

export const TransferContext = createContext<TransferProviderType | null>(null);

export default function TransferProvider({ children }: TransferProviderProps) {
  const [transferState, setTransferState] = useState<TransferStateType>({
    tokenSymbol: "",
    fromType: TransferFromTypeEnum.Own,
    fromPrincipal: "",
    fromSubAccount: "",
    toType: TransferToTypeEnum.ThirdParty,
    toPrincipal: "",
    toSubAccount: "",
  });

  console.log("transferState", transferState);
  

  const value = {
    transferState,
    setTransferState,
  };

  return <TransferContext.Provider value={{ ...value }}>{children}</TransferContext.Provider>;
}

// --------------- HOOK ---------------

export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useTransfer must be used within a TransferProvider");
  }

  return context;
};
