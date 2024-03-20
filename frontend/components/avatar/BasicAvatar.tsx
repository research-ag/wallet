import { cva, VariantProps } from "cva";
import { ImgHTMLAttributes } from "react";
import AvatarEmpty from "./AvatarEmpty";

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement>, VariantProps<typeof avatarCVA> {
  title: string;
}

export default function Avatar(props: AvatarProps) {
  const { figure, size, border, className, src, title, ...additionalProps } = props;

  if (!src) {
    return <AvatarEmpty figure={figure} size={size} border={border} className={className} title={title} />;
  }

  return (
    <img
      src={src}
      alt="Internet Computer"
      className={avatarCVA({ figure, size, border, className })}
      {...additionalProps}
    />
  );
}

const avatarCVA = cva([], {
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
      small: "w-6 h-6",
      medium: "w-8 h-8",
      large: "w-10 h-10",
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
  },
  defaultVariants: {
    figure: "rounded-md",
    size: "medium",
  },
});
