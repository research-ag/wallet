import { cva, VariantProps } from "cva";
import { useMemo, useRef, useState } from "react";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { CustomInput } from "@components/input";
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { SelectOption } from "@/@types/components";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { cleanAlphanumeric } from "@/common/utils/strings";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface TSelectProps extends VariantProps<typeof selectTriggerCVA>, VariantProps<typeof selectContentCVA> {
  options: SelectOption[];
  currentValue: string | number;
  initialValue?: string | number;
  onSelect: (option: SelectOption) => void;
  onSearch?: (searchValue: string) => void;
  onOpenChange?: (open: boolean) => void;
  componentWidth: string;
  margin?: string;
}

export default function Select(props: TSelectProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const {
    disabled,
    options,
    initialValue,
    currentValue,
    onSelect,
    onSearch,
    onOpenChange,
    border,
    componentWidth,
    margin,
  } = props;
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const selectedValue = useMemo(() => {
    const result = options.find((option) => option.value === currentValue);
    if (result) return result;

    return options.find((option) => option.value === initialValue);
  }, [currentValue]);

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild className={triggerStyles(disabled, border, componentWidth, margin || "")}>
        <div className="flex items-center justify-center">
          <div className="flex items-center mr-2">
            {selectedValue && (
              <>
                {selectedValue?.icon}
                <div className="ml-2">
                  <p className={`${textStyles()} ${selectedValue.labelClassname ? selectedValue.labelClassname : ""}`}>
                    {selectedValue?.label}
                  </p>
                  <p
                    className={`${textStyles(true)} ${
                      selectedValue.sublabelClassname ? selectedValue.sublabelClassname : ""
                    }`}
                  >
                    {selectedValue?.subLabel}
                  </p>
                </div>
              </>
            )}
            {!selectedValue && <p className={textStyles()}>{t("select.option")}</p>}
          </div>
          <DropIcon className={`fill-gray-color-4 ${isOpen ? "-rotate-90" : ""}`} />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={contentStyles(disabled, componentWidth)}>
          <div className={`w-[${componentWidth}] `}></div>
          {onSearch && (
            <div className="p-2">
              <CustomInput
                prefix={<img src={SearchIcon} className="mx-2 w-[1.2rem] h-[1rem]" alt="search-icon" />}
                onChange={handleSearchChange}
                placeholder="Search"
                className="dark:bg-SideColor bg-PrimaryColorLight h-[2.5rem]"
                inputClass="h-[2rem]"
              />
            </div>
          )}
          <div>
            {options
              .filter((option) => option.value !== selectedValue?.value)
              .map((option, index) => (
                <div
                  onClick={() => {
                    handleSelectOption(option);
                    setIsOpen(false);
                  }}
                  key={index}
                  className={getItemStyles()}
                >
                  {option?.icon}
                  <div className="ml-2">
                    <p className={`${textStyles()} ${option.labelClassname ? option.labelClassname : ""}`}>
                      {option.label}
                    </p>
                    <p className={`${textStyles(true)} ${option.sublabelClassname ? option.sublabelClassname : ""}`}>
                      {option?.subLabel}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    onOpenChange?.(open);
  }

  function handleSelectOption(option: SelectOption) {
    onSelect(option);
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newSearchValue = cleanAlphanumeric(event.target.value);
    if (onSearch) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => onSearch(newSearchValue), 100);
    }
  }
}

function textStyles(isSubLabel = false) {
  return clsx("text-start text-md text-PrimaryTextColorLight dark:text-PrimaryTextColor", isSubLabel && "opacity-50");
}

function getItemStyles() {
  return clsx(
    "flex items-center min-h-[3rem]",
    "justify-start px-2 py-2 bg-opacity-50",
    "cursor-pointer hover:bg-RadioCheckColor/50",
  );
}

const triggerStyles = (
  disabled: boolean | null | undefined,
  border: "none" | "error" | null | undefined,
  componentWidth: string,
  margin: string,
) => {
  return clsx(selectTriggerCVA({ disabled, border }), `w-[${componentWidth}]`, margin);
};

const selectTriggerCVA = cva(
  [
    "flex",
    "justify-between",
    "items-center",
    "p-2",
    "bg-ThemeColorSelectorLight dark:bg-SecondaryColor",
    "border rounded-md",
    "mt-2 ",
    "cursor-pointer",
    "px-4",
    "h-12",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
      border: {
        none: ["border", "border-BorderColorLight", "dark:border-BorderColor"],
        error: "border border-TextErrorColor",
      },
    },
    defaultVariants: {
      disabled: false,
      border: "none",
    },
    compoundVariants: [],
  },
);

const contentStyles = (disabled: boolean | null | undefined, componentWidth: string) => {
  return clsx(selectContentCVA({ disabled }), `w-[${componentWidth}]`);
};

const selectContentCVA = cva(
  [
    "mt-1 max-h-[25rem]",
    "bg-ThemeColorSelectorLight dark:bg-ThemeColorBack",
    "rounded-md border border-RadioCheckColor",
    "scroll-y-light",
    "z-[1500]",
  ],
  {
    variants: {
      disabled: {
        true: ["opacity-50 pointer-events-none"],
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);
