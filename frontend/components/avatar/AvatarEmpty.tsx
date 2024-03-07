import { HTMLAttributes } from "react";
import { VariantProps } from "cva";
import { avatarEmptyCVA } from "./styles.cva";

interface AvatarEmptyProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarEmptyCVA> {
  title: string;
}

export default function AvatarEmpty(props: AvatarEmptyProps) {
  const { className, title, figure, size, border, background, ...additionalProps } = props;
  return (
    <div className={avatarEmptyCVA({ figure, size, border, background, className })} {...additionalProps}>
      <p>{title[0]?.toUpperCase()}</p>
    </div>
  );
}
