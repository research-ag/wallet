import { VariantProps, cva } from "cva";
import { ButtonHTMLAttributes, ReactNode } from "react";

const buttonCVA = cva([
  "bg-acceptButtonColor",
  "rounded-md",
  "flex justify-center items-center",
  "w-7",
  "h-7",
  "p-0",
  "m-0",
  "hover"
], {
  variants: {},
});

export interface IButtonCVAProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonCVA> {}

export default function Button({ ...props }: IButtonCVAProps): ReactNode {
  return <button className={buttonCVA({})} {...props} />; }
