// svg
import { ReactComponent as CopyIcon } from "@assets/svg/files/copy-icon.svg";
import { ReactComponent as CopyGrayIcon } from "@/assets/svg/files/copy-gray-icon.svg";
//
import { VariantProps, cva } from "cva";
import { ButtonHTMLAttributes, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useTranslation } from "react-i18next";

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

export default function CustomCopy({
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
}: TooltipProps) {
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
          <div className="flex flex-row items-center justify-start px-2 py-1 rounded-md bg-SecondaryColorLight/50 dark:bg-SecondaryColor/50">
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
}

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
