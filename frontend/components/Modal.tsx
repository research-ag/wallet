import { Fragment } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface ModalProps {
  open: boolean;
  width?: string;
  height?: string;
  top?: string;
  background?: string;
  padding?: string;
  rounded?: string;
  text?: string;
  border?: string;
  children: any;
  overlayZIndex?: string;
  contentZIndex?: string;
}

const Modal = ({
  open,
  width = "w-[32rem]",
  height = "",
  top = "top-[50%]",
  text = "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
  background = "bg-PrimaryColorLight dark:bg-PrimaryColor",
  padding = "p-6",
  rounded = "rounded-lg",
  border = "",
  overlayZIndex = "1000",
  contentZIndex = "2000",
  children,
}: ModalProps) => {
  return (
    <Fragment>
      <Dialog.Root open={open}>
        <Dialog.Portal>
          <Dialog.Overlay
            className={`bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-[${overlayZIndex}]`}
          />
          <Dialog.Content className={`fixed ${top} left-[50%] outline-none shadow-md z-[${contentZIndex}]`}>
            <div
              className={`absolute flex flex-col justify-start items-start text-lg translate-x-[-50%] translate-y-[-50%] ${width} ${height}  ${background} ${padding} ${rounded} ${text} ${border}`}
            >
              {children}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Fragment>
  );
};

export default Modal;
