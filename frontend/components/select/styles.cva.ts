import { cva } from "cva";

export const selectTriggerCVA = cva(
  [
    "flex",
    "justify-between",
    "items-center",
    "p-2",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "border rounded-md",
    "mt-2 ",
    "cursor-pointer",
    "px-4",
    "h-14",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
      border: {
        none: ["border", "border-BorderColorLight", "dark:border-BorderColor"],
        error: "border border-TextErrorColor",
      },
    },
    defaultVariants: {
      disabled: false,
      border: "none",
    },
    compoundVariants: [],
  },
);

export const selectContentCVA = cva(
  [
    "w-fit z-50 mt-2",
    "bg-ThemeColorSelectorLight dark:bg-ThemeColorBack",
    "rounded-md border border-RadioCheckColor",
    "max-h-[30rem] scroll-y-light",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);
