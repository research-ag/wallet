import { cva } from "cva";

export const switchContainerCVA = cva(["p-0 relative rounded-full"], {
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

export const thumbCVA = cva(["block top-0 m-0 bg-white rounded-full"], {
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
