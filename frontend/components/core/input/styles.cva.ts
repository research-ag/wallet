import { cva } from "cva";

export const inputContainerCVA = cva(
  ["flex", "justify-start", "items-center", "bg-[#211E49]", "border-2", "rounded-md", "mt-2 border-[#3C3867]", "h-14"],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
      isError: {
        true: ["border border-[#FF9292]"],
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
      isError: false,
    },
  },
);

export const inputCVA = cva(["w-full", "bg-transparent", "outline-none", "px-4 py-2"], {
  variants: {},
  defaultVariants: {},
});

export const inputCurrencyCVA = cva(["flex", "bg-[#211E49]", "border-2 border-[#3C3867]", "py-2 px-4", "rounded-lg"], {
  variants: {
    isLoading: {
      true: ["opacity-50 pointer-events-none"],
      false: [""],
    },
  },
  defaultVariants: {
    isLoading: false,
  },
});
