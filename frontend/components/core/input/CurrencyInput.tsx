import { VariantProps } from "cva";
import { InputHTMLAttributes, ReactNode, useRef, useState } from "react";
import { inputCurrencyCVA } from "./styles.cva";

interface InputCurrencyProps extends InputHTMLAttributes<HTMLImageElement>, VariantProps<typeof inputCurrencyCVA> {
  onCurrencyChange: (currency: string) => void;
  icon?: ReactNode;
  currency: string;
}

export default function CurrencyInput(props: InputCurrencyProps) {
  const { className, onCurrencyChange, icon, currency, isLoading } = props;
  const [amount, setAmount] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      onCurrencyChange(newAmount);
    }, 500);
  };

  return (
    <div className={inputCurrencyCVA({ className, isLoading })}>
      <input
        type="text"
        className="w-4/5 outline-none bg-inherit"
        autoComplete="false"
        onChange={handleCurrencyChange}
        value={amount}
      />
      <div className="flex items-center justify-between">
        {icon}
        <p className="mt-1 ml-4 text-lg">{currency}</p>
      </div>
    </div>
  );
}
