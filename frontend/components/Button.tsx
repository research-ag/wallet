import { ButtonHTMLAttributes, FC } from "react";
import { cva, type VariantProps } from "cva";

const button = cva("button", {
  variants: {
    intent: {
      accept: ["bg-AccpetButtonColor", "text-white"],
      deny: ["bg-DenyButtonColor", "text-white"],
      success: ["bg-BorderSuccessColor", "text-white"],
      noBG: ["bg-transparent", "text-AccpetButtonColor"],
    },
    size: {
      icon: ["p-2", "rounded-md"],
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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export const CustomButton: FC<ButtonProps> = ({ className, intent, size, border, focusBorder, ...props }) => (
  <button className={button({ intent, size, border, focusBorder, className })} {...props} />
);
