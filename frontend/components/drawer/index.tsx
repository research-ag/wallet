import clsx from "clsx";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close-icon.svg";

interface IDrawerProps {
  isDrawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
  title?: string;
  children?: React.ReactNode;
}

export default function Drawer(props: IDrawerProps) {
  const { isDrawerOpen, setDrawerOpen, children, title } = props;
  return (
    <>
      <div className={getDrawerBlank(isDrawerOpen)} />
      <div className={getDrawerContainerStyle(isDrawerOpen)}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-bold">{title}</h1>
          <CloseIcon onClick={() => setDrawerOpen(false)} className="w-6 h-6 cursor-pointer" />
        </div>
        {children}
      </div>
    </>
  );
}

function getDrawerContainerStyle(isDrawerOpen: boolean) {
  return clsx(
    "fixed",
    "px-8 py-4",
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
