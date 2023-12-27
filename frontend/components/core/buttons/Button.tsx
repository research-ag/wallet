import { VariantProps } from "cva";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonCVA } from "./syles.cva";

export interface IButtonCVAProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonCVA> {}

export default function Button({ ...props }: IButtonCVAProps): ReactNode {
  return <button className={buttonCVA({})} {...props} />;
}

