import { ReceiverState, SenderState, TransactionError } from "@/@types/transactions";

export function validateSender(sender: SenderState): TransactionError | undefined {
  if (sender?.allowanceContactSubAccount?.contactPrincipal) {
    // TODO: validate here
    return { field: "", message: "" };
  }
  if (sender?.newAllowanceContact) {
    // TODO: validate with schema
    return { field: "", message: "" };
  }
  if (sender?.subAccount) {
    // TODO: validate with schema
    return { field: "", message: "" };
  }

  return { field: "", message: "" };
}

export function validateReceiver(receiver: ReceiverState): TransactionError | undefined {
  if (receiver?.ownSubAccount) {
    // TODO: validate with zod schema
    return { field: "", message: "" };
  }
  if (receiver?.thirdContactSubAccount) {
    // TODO: validate with zod schema
    return { field: "", message: "" };
  }
  if (receiver?.thirdNewContact) {
    // TODO: validate with zod schema
    return { field: "", message: "" };
  }

  return { field: "", message: "" };
}
