import { cva } from "cva";

export const chipCVA = cva(["h-6", "rounded-md", "font-bold"], {
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
