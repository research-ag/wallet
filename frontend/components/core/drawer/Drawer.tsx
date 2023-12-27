import { ReactComponent as CloseIcon } from "@assets/svg/files/close-icon.svg";
import { getDrawerBlank, getDrawerContainerStyle } from "./styles.cva";

interface IDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export default function Drawer(props: IDrawerProps) {
  const { isDrawerOpen, onClose, children, title } = props;
  return (
    <>
      <div className={getDrawerBlank(isDrawerOpen)} />
      <div className={getDrawerContainerStyle(isDrawerOpen)}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">{title}</h1>
          <CloseIcon onClick={onClose} className="w-6 h-6 cursor-pointer" />
        </div>
        {children}
      </div>
    </>
  );
}
