import { cva, VariantProps } from "cva";
import { InputHTMLAttributes, ReactNode } from "react";

interface InputCurrencyProps extends InputHTMLAttributes<HTMLImageElement>, VariantProps<typeof inputCurrencyCVA> {
  onCurrencyChange: (currency: string) => void;
  icon?: ReactNode;
  currency: string;
  value?: string;
}

export default function CurrencyInput(props: InputCurrencyProps) {
  const { className, onCurrencyChange, icon, currency, isLoading, value, border } = props;

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    onCurrencyChange(newAmount);
  };

  return (
    <div className={inputCurrencyCVA({ className, isLoading, border })}>
      <input
        type="text"
        className="w-7/12 outline-none bg-inherit"
        autoComplete="false"
        onChange={handleCurrencyChange}
        value={value || ""}
      />
      <div className="flex items-center w-fit">
        {icon} <p className="ml-1 text-md">{currency}</p>
      </div>
    </div>
  );
}

const inputCurrencyCVA = cva(
  [
    "flex justify-between",
    "border",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
    "py-2 px-4",
    "rounded-lg",
    "h-12",
  ],
  {
    variants: {
      isLoading: {
        true: ["opacity-50 pointer-events-none"],
        false: [""],
      },
      border: {
        error: ["border border-TextErrorColor"],
        none: ["border", "border-BorderColorLight", "dark:border-BorderColor"],
      },
    },
    defaultVariants: {
      isLoading: false,
      border: "none",
    },
  },
);
