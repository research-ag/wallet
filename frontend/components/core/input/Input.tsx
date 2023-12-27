import { VariantProps } from "cva";
import { InputHTMLAttributes } from "react";
import { inputCVA, inputContainerCVA } from "./styles.cva";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "disabled">,
    VariantProps<typeof inputCVA>,
    VariantProps<typeof inputContainerCVA> {}

export default function Input(props: InputProps) {
  const { disabled, isError, ...additionalProps } = props;
  return (
    <div className={inputContainerCVA({ disabled, isError })}>
      <input className={inputCVA({})} {...additionalProps} />
    </div>
  );
}
