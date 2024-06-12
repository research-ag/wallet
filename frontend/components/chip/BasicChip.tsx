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

const chipCVA = cva(["h-6", "rounded-md"], {
  variants: {
    type: {
      gray: ["text-PrimaryTextColorLight dark:text-PrimaryTextColor dark:bg-gray-color-4 bg-gray-color-7"],
    },
    size: {
      small: ["text-sm", "px-2", "py-0.5", "h-6"],
      medium: ["text-md", "px-2", "py-0.5", "h-6"],
      large: ["text-lg", "px-2.5", "py-1", "h-6"],
      square: ["text-lg", "h-8", "w-8", "flex justify-center items-center"],
    },
  },
  defaultVariants: {
    type: "gray",
    size: "small",
  },
});
