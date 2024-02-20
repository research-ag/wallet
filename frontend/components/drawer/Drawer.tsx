import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { getDrawerBlank, getDrawerContainerStyle } from "./styles.cva";
import clsx from "clsx";

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">{title}</h1>
            <CloseIcon
              onClick={() => {
                if (enableClose) onClose?.();
              }}
              className={getCloseIconStyles(enableClose)}
            />
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
