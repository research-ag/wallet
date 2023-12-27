// TODO: migrate to cva instead of clsx
import clsx from "clsx";

export function getDrawerContainerStyle(isDrawerOpen: boolean) {
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

export function getDrawerBlank(isDrawerOpen: boolean) {
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
