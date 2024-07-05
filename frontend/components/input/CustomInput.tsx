import { VariantProps, cva } from "cva";
import { InputHTMLAttributes } from "react";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input>,
    VariantProps<typeof inputComp> {
  compInClass?: string;
  compOutClass?: string;
  prefix?: any;
  prefixPosition?: "out" | "in";
  sufix?: any;
  sufixPosition?: "out" | "in";
  inputClass?: string;
}

export default function CustomInput({
  className,
  sizeInput,
  textStyle,
  intent,
  border,
  sizeComp,
  prefix,
  prefixPosition = "in",
  sufix,
  sufixPosition = "in",
  compInClass = "",
  compOutClass = "",
  inputClass = "",
  ...props
}: InputProps) {
  return (
    <div className={`relative rounded flex flex-row justify-start items-center w-full gap-1 ${compOutClass}`}>
      {prefix && prefixPosition === "out" && prefix}
      <div
        lang="en-US"
        className={`realtive flex flex-row justify-start items-center w-full px-1 cursor-text ${inputComp({
          intent,
          border,
          sizeComp,
          className,
        })} ${compInClass}`}
      >
        {prefix && prefixPosition === "in" && prefix}
        <input
          autoComplete="false"
          spellCheck={false}
          className={`w-full bg-inherit outline-none mx-1 py-2 ${inputClass} ${input({
            sizeInput,
            textStyle,
          })}`}
          {...props}
        />
        {sufix && sufixPosition === "in" && sufix}
      </div>
      {sufix && sufixPosition === "out" && sufix}
    </div>
  );
}

const inputComp = cva("button", {
  variants: {
    intent: {
      inherit: ["bg-inherit"],
      primary: ["bg-PrimaryColorLight", "dark:bg-PrimaryColor"],
      secondary: ["bg-SecondaryColorLight", "dark:bg-SecondaryColor"],
    },
    border: {
      none: ["border-0"],
      primary: ["border", "border-BorderColorLight", "dark:border-BorderColor"],
      secondary: ["border", "border-BorderColorTwoLight", "dark:border-BorderColorTwo"],
      selected: ["border", "border-SelectRowColor"],
      error: ["border", "border-TextErrorColor"],
    },
    sizeComp: {
      small: ["rounded-sm"],
      medium: ["rounded"],
      large: ["rounded-md"],
      xLarge: ["rounded-lg"],
    },
  },
  defaultVariants: {
    intent: "inherit",
    border: "primary",
    sizeComp: "medium",
  },
});

const input = cva("button", {
  variants: {
    sizeInput: {
      small: ["text-sm"],
      medium: ["text-md"],
      large: ["text-lg"],
      xLarge: ["text-xl"],
    },
    textStyle: {
      inherit: [
        "text-PrimaryTextColorLight",
        "dark:text-PrimaryTextColor",
        "placeholder:text-PrimaryTextColorLight/60",
        "dark:placeholder:text-PrimaryTextColor/60",
      ],
      primary: [
        "text-PrimaryTextColorLight",
        "dark:text-PrimaryTextColor",
        "placeholder:text-PrimaryTextColorLight/30",
        "dark:placeholder:text-PrimaryTextColor/30",
      ],
      secondary: [
        "text-SecondaryTextColorLight",
        "dark:text-SecondaryTextColor",
        "placeholder:text-SecondaryTextColorLight/30",
        "dark:placeholder:text-SecondaryTextColor/30",
      ],
    },
  },
  defaultVariants: {
    sizeInput: "large",
    textStyle: "primary",
  },
});
