import CheckIcon from "@assets/svg/files/check.svg";
import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "cva";

export interface CheckProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
  checked: boolean;
  icon?: any;
  checkedBG?: string;
}

export default function CustomCheck({
  className,
  rounding,
  size,
  border,
  icon,
  checked,
  checkedBG = "!bg-SelectRowColor",
  ...props
}: CheckProps) {
  return (
    <button
      className={`flex justify-center items-center cursor-pointer ${button({ rounding, size, border, className })} ${
        checked ? checkedBG : "bg-transparent"
      }`}
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

const button = cva("button", {
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
  },
});
