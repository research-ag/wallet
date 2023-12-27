import * as Dialog from "@radix-ui/react-dialog";
import { ReactElement } from "react";

interface ModalProps {
  triggerComponent: ReactElement;
  onConfirm: () => void;
  cancelComponent: ReactElement;
  contentComponent: ReactElement;
  icon: ReactElement;
}

const DialogDemo = ({ triggerComponent, cancelComponent, icon, onConfirm, contentComponent }: ModalProps) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>{triggerComponent}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 transition-all bg-black/50" />
      <Dialog.Content className="bg-[#211E49] border rounded-lg border-[#444277] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-[28rem]">
        <div className="flex items-center justify-between">
          {icon}
          <Dialog.Close asChild>{cancelComponent}</Dialog.Close>
        </div>

        {contentComponent}

        <div className="flex justify-end w-full mt-4">
          <Dialog.Close asChild className="">
            <button className="bg-[#33B2EF] rounded-lg py-2" onClick={onConfirm}>
              Yes
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogDemo;
