import * as RadixSwitch from "@radix-ui/react-switch";
import { VariantProps } from "cva";
import { switchContainerCVA, thumbCVA } from "./styles.cva";

interface SwitchProps extends VariantProps<typeof switchContainerCVA> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Switch(props: SwitchProps) {
  const { disabled, checked, onChange } = props;

  const handleChecked = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <RadixSwitch.Root
      id="airplane-mode"
      checked={checked}
      onCheckedChange={handleChecked}
      className={switchContainerCVA({ disabled, checked })}
    >
      <RadixSwitch.Thumb className={thumbCVA({ checked })} />
    </RadixSwitch.Root>
  );
}
