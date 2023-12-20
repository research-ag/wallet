import { cva, VariantProps } from "cva";
import { InputHTMLAttributes, useState } from "react";

const checkBoxCVA = cva([], {
  variants: {
    checkboxSize: {
      small: "h-4 w-4",
      medium: "h-5 w-5",
      large: "h-6 w-6",
    },
  },
  defaultVariants: {
    checkboxSize: "small",
  },
});

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof checkBoxCVA> {
  checked?: boolean;
  onCheckedChange: (isChecked: boolean) => void;
}

export default function Checkbox(props: CheckBoxProps) {
  const { onCheckedChange, className, checkboxSize, checked = true } = props;
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isCheckedValue = event.target.checked;
    setIsChecked(isCheckedValue);
    onCheckedChange(isCheckedValue);
  };

  return (
    <div className={checkBoxCVA({ className })}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleSwitchChange}
        className={checkBoxCVA({ checkboxSize })}
      />
    </div>
  );
}
