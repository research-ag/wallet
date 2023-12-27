import { cva } from "cva";

export const chipCVA = cva(["w-fit", "rounded-md", "font-bold"], {
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
