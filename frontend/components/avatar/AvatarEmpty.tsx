import { HTMLAttributes } from "react";
import { VariantProps, cva } from "cva";

// TODO JULIO: remove hard code colors

const avatarEmptyCVA = cva(["flex", "justify-center", "items-center", "font-bold"], {
  variants: {
    figure: {
      square: "rounded-none",
      circle: "rounded-full",
      triangle: "rounded-tr",
      rounded: "rounded",
      "rounded-md": "rounded-md",
      "rounded-lg": "rounded-lg",
      "rounded-full": "rounded-full",
    },
    size: {
      small: "w-6 h-6 text-sm",
      medium: "w-8 h-8 text-md",
      large: "w-10 h-10 text-lg",
    },
    border: {
      none: "border-none",
      primary: "border-primary",
      secondary: "border-secondary",
      warning: "border-warning",
      danger: "border-danger",
      success: "border-success",
      info: "border-info",
      inherit: "border-inherit",
    },
    background: {
      none: "bg-transparent",
      primary: "bg-primary",
      secondary: "bg-secondary",
      warning: "bg-warning",
      danger: "bg-danger",
      success: "bg-success",
      info: "bg-info",
      inherit: "bg-inherit",
      gray: "bg-gray-700",
    },
  },
  defaultVariants: {
    figure: "rounded-lg",
    size: "medium",
    background: "gray",
  },
});

interface AvatarEmptyProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarEmptyCVA> {
  title: string;
}

export default function AvatarEmpty(props: AvatarEmptyProps) {
  const { className, title, figure, size, border, background, ...additionalProps } = props;
  return (
    <div className={avatarEmptyCVA({ figure, size, border, background, className })} {...additionalProps}>
      <p>{title[0].toUpperCase()}</p>
    </div>
  );
}
