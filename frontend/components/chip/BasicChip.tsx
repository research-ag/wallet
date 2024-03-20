import { cva, VariantProps } from "cva";

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

const chipCVA = cva(["h-6", "rounded-md", "font-bold"], {
  variants: {
    type: {
      gray: ["bg-[#7D7B91]"],
    },
    size: {
      small: ["text-sm", "px-2", "py-0.5"],
      medium: ["text-md", "px-2", "py-0.5"],
      large: ["text-lg", "px-2.5", "px-1"],
    },
  },
  defaultVariants: {
    type: "gray",
    size: "small",
  },
});
