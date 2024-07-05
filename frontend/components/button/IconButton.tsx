import { VariantProps, cva } from "cva";
import { ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof iconButtonCVA> {
  icon: ReactNode;
}

export default function IconButton(props: IconButtonProps) {
  const { icon, className, onClick, color, enabled, size } = props;

  return (
    <button className={iconButtonCVA({ className, color, enabled, size })} onClick={onClick}>
      {icon}
    </button>
  );
}

const iconButtonCVA = cva(["bg-AccpetButtonColor", "m-0", "rounded-md"], {
  variants: {
    color: {
      inherit: [],
      primary: ["bg-AccpetButtonColor"],
      secondary: [],
      success: [],
      error: [],
      info: [],
      warning: [],
    },
    enabled: {
      false: ["opacity-50 cursor-not-allowed"],
      true: [],
    },
    size: {
      small: ["p-0.5"],
      medium: ["p-1"],
      large: ["p-2"],
    },
  },
  compoundVariants: [],
  defaultVariants: {
    color: "primary",
    enabled: true,
    size: "small",
  },
});
