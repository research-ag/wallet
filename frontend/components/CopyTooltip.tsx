import * as Popover from "@radix-ui/react-popover";

import { ButtonHTMLAttributes, FC, useState } from "react";
//
import { VariantProps, cva } from "cva";

import CopyGrayIcon from "@/assets/svg/files/copy-gray-icon.svg?react";
// svg
import CopyIcon from "@assets/svg/files/copy-icon.svg?react";
import { useTranslation } from "react-i18next";

const customCopy = cva("customCopy", {
  variants: {
    background: {
      default: ["bg-AccpetButtonColor"],
      noBG: ["bg-transparent"],
    },
    rounded: {
      small: ["rounded-sm"],
      medium: ["rounded"],
      large: ["rounded-md"],
      xLarge: ["rounded-lg"],
    },
    boxSize: {
      none: ["p-0"],
      small: ["p-1"],
    },
  },
  defaultVariants: {
    boxSize: "none",
    background: "noBG",
    rounded: "medium",
  },
});

const copyIcon = cva("copyIcon", {
  variants: {
    size: {
      xSmall: ["w-3", "h-3"],
      small: ["w-4", "h-4"],
      medium: ["w-5", "h-5"],
      large: ["w-6", "h-6"],
      xLarge: ["w-8", "h-8"],
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export interface TooltipProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof copyIcon>,
    VariantProps<typeof customCopy> {
  side?: "top" | "right" | "bottom" | "left" | undefined;
  sideOffset?: number | undefined;
  align?: "center" | "end" | "start" | undefined;
  alignOffset?: number | undefined;
  showTime?: number | undefined;
  copyStroke?: string;
  copyText?: string;
  isTransaction?: boolean;
}

export const CustomCopy: FC<TooltipProps> = ({
  className,
  copyText = "copy",
  background,
  rounded,
  size,
  boxSize,
  side = "top",
  sideOffset = 0,
  align = "start",
  alignOffset = 0,
  showTime = 1000,
  copyStroke = "fill-PrimaryTextColorLight dark:fill-PrimaryTextColor",
  isTransaction = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open}>
      <Popover.Trigger asChild>
        <button
          onClick={handleCopyClic}
          className={`p-0 ${customCopy({ background, rounded, boxSize, className })}`}
          {...props}
        >
          {isTransaction ? (
            <CopyGrayIcon className={`!stroke-0 ${copyStroke} ${copyIcon({ size })}`} />
          ) : (
            <CopyIcon className={`!stroke-0 ${copyStroke} ${copyIcon({ size })}`} />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal className="z-[9999]">
        <Popover.Content
          className="z-[9999] shadow-md"
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <div className="flex flex-row justify-start items-center py-1 px-2 bg-SecondaryColorLight/50 dark:bg-SecondaryColor/50 rounded-md">
            <p className="text-sm text-PrimaryTextColorLight/60 dark:text-PrimaryTextColor/60">{t("copied")}</p>
          </div>
          <Popover.Arrow className="fill-SecondaryColorLight/50 dark:fill-SecondaryColor/50" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );

  function handleCopyClic() {
    navigator.clipboard.writeText(copyText);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, showTime);
  }
};
