import { ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "cva";
import CheckIcon from "@assets/svg/files/check.svg";

export interface CheckProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof checkBoxCVA> {
  checked: boolean;
  icon?: any;
  checkedBG?: string;
  disabled?: boolean;
}

export default function CheckBox({
  className,
  rounding,
  size,
  border,
  icon,
  checked,
  disabled,
  checkedBG = "!bg-SelectRowColor",
  ...props
}: CheckProps) {
  return (
    <button
      className={`flex justify-center items-center cursor-pointer ${checkBoxCVA({
        disabled,
        rounding,
        size,
        border,
        className,
      })} ${checked ? checkedBG : "bg-transparent"}`}
      {...props}
    >
      {icon ? (
        icon
      ) : (
        <img src={CheckIcon} className={`w-[0.5] h-[0.5rem] ${!checked ? "invisible" : ""}`} alt="check-icon" />
      )}
    </button>
  );
}

export const checkBoxCVA = cva("button", {
  variants: {
    rounding: {
      sm: ["rounded-sm"],
      md: ["rounded"],
      lg: ["rounded-lg"],
      full: ["rounded-full"],
    },
    size: {
      small: ["text-md", "p-1"],
      medium: ["text-lg", "p-3"],
      large: ["text-xl", "p-4"],
    },
    border: {
      none: ["border-0"],
      border: ["border"],
      underline: ["border-0", "border-b", "!px-0", "!rounded-none", "!pb-0"],
    },
    disabled: {
      true: ["opacity-50 pointer-events-none"],
      false: "",
    },
  },
  compoundVariants: [
    {
      rounding: "md",
      border: "border",
      class: "",
    },
  ],
  defaultVariants: {
    rounding: "md",
    size: "small",
    border: "border",
    disabled: false,
  },
});
