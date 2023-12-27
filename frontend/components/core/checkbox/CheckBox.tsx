import { VariantProps } from "cva";
import { InputHTMLAttributes } from "react";
import { checkBoxCVA } from "./styles.cva";

interface CheckBoxProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof checkBoxCVA> {
  checked: boolean;
  onCheckedChange: (isChecked: boolean) => void;
  disabled?: boolean;
}

export default function CheckBox(props: CheckBoxProps) {
  const { onCheckedChange, className, checkboxSize, checked, disabled } = props;

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isCheckedValue = event.target.checked;
    onCheckedChange(isCheckedValue);
  };

  return (
    <div className={checkBoxCVA({ className, disabled })}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleSwitchChange}
        className={checkBoxCVA({ checkboxSize })}
      />
    </div>
  );
}
