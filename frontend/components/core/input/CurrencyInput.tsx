import { VariantProps } from "cva";
import { InputHTMLAttributes, ReactNode, useState } from "react";
import { inputCurrencyCVA } from "./styles.cva";

interface InputCurrencyProps extends InputHTMLAttributes<HTMLImageElement>, VariantProps<typeof inputCurrencyCVA> {
  onCurrencyChange: (currency: string) => void;
  icon?: ReactNode;
  currency: string;
  value?: string;
}

export default function CurrencyInput(props: InputCurrencyProps) {
  const { className, onCurrencyChange, icon, currency, isLoading, value, border } = props;
  const [amount, setAmount] = useState("");

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    onCurrencyChange(newAmount);
  };

  return (
    <div className={inputCurrencyCVA({ className, isLoading, border })}>
      <input
        type="text"
        className="w-4/5 outline-none bg-inherit"
        autoComplete="false"
        onChange={handleCurrencyChange}
        value={amount || value || ""}
      />
      <div className="flex items-center justify-between">
        {icon}
        <p className="mt-1 ml-4 text-lg">{currency}</p>
      </div>
    </div>
  );
}
