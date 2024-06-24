import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "cva";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export default function CustomButton({ className, intent, size, border, focusBorder, ...props }: ButtonProps) {
  return <button className={button({ intent, size, border, focusBorder, className })} {...props} />;
}

const button = cva("button", {
  variants: {
    intent: {
      accept: ["bg-slate-color-info", "text-white"],
      deny: ["bg-DenyButtonColor", "text-white"],
      error: ["bg-slate-color-error", "text-white"],
      success: ["bg-slate-color-success", "text-white"],
      noBG: ["bg-transparent", "text-AccpetButtonColor"],
    },
    size: {
      icon: ["p-2", "rounded-md"],
      xSmall: ["text-sm", "py-0.5", "px-1", "rounded-md"],
      small: ["text-md", "py-1", "px-2", "rounded-md"],
      medium: ["text-lg", "py-2", "px-4", "rounded-lg", "font-semibold"],
      large: ["text-xl", "py-3", "px-5", "rounded-lg", "font-semibold"],
    },
    border: {
      none: ["border-0"],
      underline: ["border-0", "border-b", "!px-0", "!rounded-none", "!py-0"],
    },
    focusBorder: {
      none: ["focus-visible:outline-none"],
      auto: [""],
    },
  },
  compoundVariants: [
    {
      intent: "noBG",
      border: "underline",
      class: "",
      focusBorder: "none",
    },
  ],
  defaultVariants: {
    intent: "accept",
    size: "medium",
    border: "none",
    focusBorder: "none",
  },
});
