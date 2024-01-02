import { cva } from "cva";

export const inputContainerCVA = cva(
  ["flex", "justify-start", "items-center", "bg-[#211E49]", "border", "rounded-md", "mt-2 border-[#3C3867]", "h-14"],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
      border: {
        error: ["border-[#FF9292]"],
        none: "",
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

export const inputCurrencyCVA = cva(["flex", "bg-[#211E49]", "border", "py-2 px-4", "rounded-lg"], {
  variants: {
    isLoading: {
      true: ["opacity-50 pointer-events-none"],
      false: [""],
    },
    border: {
      error: ["border-[#FF9292]"],
      none: "border-[#3C3867]",
    },
  },
  defaultVariants: {
    isLoading: false,
    border: "none",
  },
});
