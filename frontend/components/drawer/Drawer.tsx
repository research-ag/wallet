import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import { getDrawerBlank, getDrawerContainerStyle } from "./styles.cva";

interface IDrawerProps {
  isDrawerOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}

export default function Drawer(props: IDrawerProps) {
  const { isDrawerOpen, onClose, children, title } = props;
  return (
    <>
      <div className={getDrawerBlank(isDrawerOpen)} />
      <div className={getDrawerContainerStyle(isDrawerOpen)}>
        {title && onClose && (
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">{title}</h1>
            <CloseIcon
              onClick={() => onClose?.()}
              className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            />
          </div>
        )}
        {children}
      </div>
    </>
  );
}
