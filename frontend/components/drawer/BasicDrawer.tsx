import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { clsx } from "clsx";

interface IDrawerProps {
  isDrawerOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  enableClose?: boolean;
}

export default function Drawer(props: IDrawerProps) {
  const { isDrawerOpen, onClose, children, title, enableClose = true } = props;
  return (
    <>
      <div className={getDrawerBlank(isDrawerOpen)} />
      <div className={getDrawerContainerStyle(isDrawerOpen)}>
        {title && onClose && (
          <div className="flex items-center justify-between px-8 mt-8 mb-8">
            <h1 className="text-xl font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">{title}</h1>
            <CloseIcon onClick={() => onClose?.()} className={getCloseIconStyles(enableClose)} />
          </div>
        )}
        {children}
      </div>
    </>
  );
}

function getCloseIconStyles(enabled: boolean) {
  return clsx(
    "cursor-pointer",
    enabled
      ? "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
      : "stroke-PrimaryTextColorLight/50 dark:stroke-PrimaryTextColor/50 cursor-not-allowed",
  );
}

function getDrawerContainerStyle(isDrawerOpen: boolean) {
  return clsx(
    "fixed",
    "z-[1000]",
    "w-[28rem]",
    "h-screen",
    "top-0",
    "bg-PrimaryColorLight",
    "dark:bg-PrimaryColor",
    "transition-{right}",
    "duration-500",
    "ease-in-out",
    "flex flex-col",
    isDrawerOpen ? "right-0" : "-right-[28rem]",
  );
}

function getDrawerBlank(isDrawerOpen: boolean) {
  return clsx(
    "fixed",
    "top-0",
    "bottom-0",
    "left-0",
    "right-0",
    "z-50",
    "bg-black",
    "opacity-50",
    "transition-opacity",
    "duration-500",
    "ease-in-out",
    !isDrawerOpen && "hidden",
  );
}
