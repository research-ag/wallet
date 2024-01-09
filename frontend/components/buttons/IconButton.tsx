import { VariantProps, cva } from "cva";
import { ButtonHTMLAttributes, ReactNode } from "react";

const iconButtonCVA = cva(["bg-acceptButtonColor", "p-1", "m-0", "rounded-md"], {
  variants: {},
  defaultVariants: {},
});

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconButtonCVA> {
  icon: ReactNode;
}

export default function IconButton(props: IconButtonProps) {
  const { icon, className, onClick } = props;

  return (
    <button className={iconButtonCVA({ className })} onClick={onClick}>
      {icon}
    </button>
  );
}
