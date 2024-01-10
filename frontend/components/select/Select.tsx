import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { VariantProps } from "cva";
import { useMemo, useRef, useState } from "react";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import { CustomInput } from "@components/Input";
import SearchIcon from "@assets/svg/files/icon-search.svg";
import { SelectOption } from "@/@types/core";
import { selectContentCVA, selectTriggerCVA } from "./styles.cva";
import clsx from "clsx";

interface TSelectProps extends VariantProps<typeof selectTriggerCVA>, VariantProps<typeof selectContentCVA> {
  options: SelectOption[];
  currentValue: string | number;
  initialValue?: string | number;
  onSelect: (option: SelectOption) => void;
  onSearch?: (searchValue: string) => void;
  onOpenChange?: (open: boolean) => void;
}

export default function Select(props: TSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { disabled, options, initialValue, currentValue, onSelect, onSearch, onOpenChange, border } = props;
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const selectedValue = useMemo(() => {
    const result = options.find((option) => option.value === currentValue);
    if (result) return result;
    return options.find((option) => option.value === initialValue);
  }, [currentValue]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleSelectOption = (option: SelectOption) => onSelect(option);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = event.target.value.replace(/\s/g, "");
    if (onSearch) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => onSearch(newSearchValue), 100);
    }
  };

  return (
    <DropdownMenu.Root modal={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild className={selectTriggerCVA({ disabled, border })}>
        <div className="flex items-center justify-center">
          <div className="flex items-center mr-2">
            {selectedValue?.icon}
            <div className="ml-2">
              <p className={textStyles()}>{selectedValue?.label}</p>
              <p className={textStyles(true)}>{selectedValue?.subLabel}</p>
            </div>
          </div>
          <DropIcon className={isOpen ? "-rotate-90" : ""} />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={selectContentCVA({ disabled })}>
        {onSearch && (
          <DropdownMenu.Group className="p-2">
            <CustomInput
              prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
              onChange={handleSearchChange}
              placeholder="Search"
              className="dark:bg-SideColor bg-PrimaryColorLight"
            />
          </DropdownMenu.Group>
        )}
        <DropdownMenu.Group>
          {options.map((option, index) => (
            <DropdownMenu.Item
              onSelect={() => handleSelectOption(option)}
              key={index}
              className="flex items-center justify-start px-2 py-2 bg-opacity-50 cursor-pointer hover:bg-RadioCheckColor"
            >
              {option?.icon}
              <div className="ml-2">
                <p className={textStyles()}>{option.label}</p>
                <p className={textStyles(true)}>{option?.subLabel}</p>
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

const textStyles = (isSubLabel = false) =>
  clsx("text-PrimaryTextColorLight dark:text-PrimaryTextColor", isSubLabel && "opacity-50");