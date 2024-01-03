import { VariantProps } from "cva";
import { chipCVA } from "./styles.cva";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof chipCVA> {
  text: string;
}

export default function Chip(props: ChipProps) {
  const { className, text, type, size, ...additionalProps } = props;
  return (
    <span className={chipCVA({ type, size, className })} {...additionalProps}>
      {text}
    </span>
  );
}
