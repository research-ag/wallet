import { VariantProps } from "cva";
import { ImgHTMLAttributes } from "react";
import AvatarEmpty from "./AvatarEmpty";
import { avatarCVA } from "./styles.cva";

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
