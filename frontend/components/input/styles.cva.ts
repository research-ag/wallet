import { cva } from "cva";

export const inputContainerCVA = cva(
  [
    "flex",
    "justify-start",
    "items-center",
    "rounded-md",
    "mt-2",
    "h-14",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
      border: {
        error: ["border border-TextErrorColor"],
        none: ["border", "border-BorderColorLight", "dark:border-BorderColor"],
      },
    },
    defaultVariants: {
      disabled: false,
      border: "none",
    },
  },
);

export const inputCVA = cva(["w-full", "bg-transparent", "outline-none", "px-4 py-2"], {
  variants: {},
  defaultVariants: {},
});

export const inputCurrencyCVA = cva(
  [
    "flex",
    "border",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
    "py-2 px-4",
    "rounded-lg",
  ],
  {
    variants: {
      isLoading: {
        true: ["opacity-50 pointer-events-none"],
        false: [""],
      },
      border: {
        error: ["border border-TextErrorColor"],
        none: ["border", "border-BorderColorLight", "dark:border-BorderColor"],
      },
    },
    defaultVariants: {
      isLoading: false,
      border: "none",
    },
  },
);
