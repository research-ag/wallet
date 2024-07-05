import * as RadixSwitch from "@radix-ui/react-switch";
import { cva, VariantProps } from "cva";

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

const switchContainerCVA = cva(["p-0 relative rounded-full"], {
  variants: {
    disabled: {
      true: ["opacity-60 pointer-events-none"],
    },
    checked: {
      false: ["bg-AccpetButtonColor"],
      true: ["bg-[#26A17B]"],
    },
    size: {
      small: ["w-6 h-3"],
      medium: ["w-8 h-4"],
      large: ["w-10 h-5"],
      xlarge: ["w-12 h-6"],
    },
  },
  defaultVariants: {
    disabled: false,
    checked: true,
    size: "medium",
  },
  compoundVariants: [],
});

const thumbCVA = cva(["block top-0 m-0 bg-white rounded-full"], {
  variants: {
    checked: {
      true: ["translate-x-4"],
      false: [""],
    },
    size: {
      small: ["w-2 h-2"],
      medium: ["w-3 h-3"],
      large: ["w-4 h-4"],
      xlarge: ["w-5 h-5"],
    },
  },
  defaultVariants: {
    checked: true,
    size: "medium",
  },
  compoundVariants: [],
});
