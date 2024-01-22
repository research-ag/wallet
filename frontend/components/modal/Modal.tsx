import LoadingLoader from "@components/Loader";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactElement } from "react";

interface ModalProps {
  triggerComponent: ReactElement;
  cancelComponent: ReactElement;
  contentComponent: ReactElement;
  icon: ReactElement;
  isLoading?: boolean;
  disabled?: boolean;
  onConfirm: () => void;
}

const DialogDemo = ({
  triggerComponent,
  cancelComponent,
  icon,
  onConfirm,
  contentComponent,
  isLoading,
  disabled,
}: ModalProps) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>{triggerComponent}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 transition-all bg-black/50" />
      <Dialog.Content className="border rounded-md bg-PrimaryColorLight dark:bg-PrimaryColor border-BorderColorLight dark:border-BorderColor fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 w-[24rem]">
        <div className="flex items-center justify-between">
          {icon}
          <Dialog.Close asChild>{cancelComponent}</Dialog.Close>
        </div>

        {contentComponent}

        <div className="flex justify-end w-full mt-4">
          <Dialog.Close asChild className="">
            <button
              className={`bg-RadioCheckColor rounded-lg py-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
              onClick={onConfirm}
            >
              {isLoading && <LoadingLoader />}
              Yes
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogDemo;
