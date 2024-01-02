import { ButtonHTMLAttributes, FC } from "react";
import { checkBoxCVA } from "./styles.cva";
import { VariantProps } from "cva";
import CheckIcon from "@assets/svg/files/check.svg";

export interface CheckProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof checkBoxCVA> {
  checked: boolean;
  icon?: any;
  checkedBG?: string;
  disabled?: boolean;
}

const CheckBox: FC<CheckProps> = ({
  className,
  rounding,
  size,
  border,
  icon,
  checked,
  disabled,
  checkedBG = "!bg-SelectRowColor",
  ...props
}) => (
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

export default CheckBox;
