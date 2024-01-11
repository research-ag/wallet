import { VariantProps } from "cva";
import { ButtonHTMLAttributes } from "react";
import { buttonCVA } from "./syles.cva";
import LoadingLoader from "@components/Loader";

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
