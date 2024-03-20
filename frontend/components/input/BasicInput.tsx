import { cva, VariantProps } from "cva";
import { InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "disabled">,
    VariantProps<typeof inputCVA>,
    VariantProps<typeof inputContainerCVA> {}

export default function Input(props: InputProps) {
  const { disabled, border, ...additionalProps } = props;
  return (
    <div className={inputContainerCVA({ disabled, border })}>
      <input className={inputCVA({})} {...additionalProps} />
    </div>
  );
}

export const inputContainerCVA = cva(
  [
    "flex",
    "justify-start",
    "items-center",
    "rounded-md",
    "mt-2",
    "h-14",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
      border: {
        error: ["border border-TextErrorColor"],
        none: ["border", "border-BorderColorLight", "dark:border-BorderColor"],
      },
    },
    defaultVariants: {
      disabled: false,
      border: "none",
    },
  },
);

const inputCVA = cva(["w-full", "bg-transparent", "outline-none", "px-4 py-2"], {
  variants: {},
  defaultVariants: {},
});
