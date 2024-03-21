import { cva, VariantProps } from "cva";
import { ButtonHTMLAttributes } from "react";
import { LoadingLoader } from "@components/loader";

export interface IButtonCVAProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonCVA> {
  disabled?: boolean;
  isLoading?: boolean;
}

export default function Button({ className, children, disabled, isLoading, ...props }: IButtonCVAProps) {
  return (
    <button className={buttonCVA({ disabled, className })} {...props}>
      {isLoading && <LoadingLoader className="mr-2" />}
      {children}
    </button>
  );
}

export const buttonCVA = cva(["bg-AccpetButtonColor", "rounded-md", "flex justify-center items-center", "p-2"], {
  variants: {
    disabled: {
      true: ["opacity-50 pointer-events-none"],
      false: "",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});
