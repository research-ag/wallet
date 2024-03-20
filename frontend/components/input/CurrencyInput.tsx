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
        className="w-4/5 outline-none bg-inherit"
        autoComplete="false"
        onChange={handleCurrencyChange}
        value={value || ""}
      />
      <div className="flex items-center justify-between">
        {icon}
        <p className="mt-1 ml-4 text-lg">{currency}</p>
      </div>
    </div>
  );
}

const inputCurrencyCVA = cva(
  [
    "flex",
    "border",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "text-PrimaryTextColorLight dark:text-PrimaryTextColor",
    "py-2 px-4",
    "rounded-lg",
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
