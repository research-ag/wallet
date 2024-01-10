import { cva } from "cva";

export const buttonCVA = cva(["bg-AccpetButtonColor", "rounded-md", "flex justify-center items-center", "p-2"], {
  variants: {
    disabled: {
      true: ["opacity-50 pointer-events-none"],
      false: "",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});
