import { ReactElement } from "react";

export interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: ReactElement;
}
