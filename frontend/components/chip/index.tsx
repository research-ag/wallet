import { VariantProps, cva } from "cva";

// TODO JULIO: remove bg colors hardcode
const chipCVA = cva(["w-fit", "rounded-md", "font-bold"], {
  variants: {
    type: {
      primary: ["bg-[#00A76F]"],
      secondary: ["bg-[#8E33FF]"],
      error: ["bg-[#FF5630]"],
      warning: ["bg-[#FFAB00]"],
      info: ["bg-[#00B8D9]"],
      success: ["bg-[#22C55E]"],
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
