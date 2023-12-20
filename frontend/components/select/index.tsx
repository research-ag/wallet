import clsx from "clsx";
import { ReactElement, useMemo, useRef, useState } from "react";
import { CustomInput } from "@components/Input";
import { ReactComponent as DropIcon } from "@assets/svg/files/chevron-right-icon.svg";
import SearchIcon from "@assets/svg/files/icon-search.svg";
import LoadingLoader from "@components/Loader";

interface SelectOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: ReactElement;
}

interface SelectProps {
  options: SelectOption[];
  defaultOption?: SelectOption;
  isLoading?: boolean;
  onSelectChange?: (option: SelectOption) => void;
  onSearchChange?: (searchValue: string) => void;
}

const initialState: SelectOption = { label: "Select an option", value: "" };

// TODO JULIO: remove hard code colors

export default function Select(props: SelectProps) {
  const { isLoading, onSelectChange, onSearchChange, defaultOption = initialState } = props;

  const [selectedOption, setSelectedOption] = useState<SelectOption>(defaultOption);
  const [open, setOpen] = useState<boolean>(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const options = useMemo(() => props.options, [props.options]);

  const handleSelectOption = (option: SelectOption) => {
    setSelectedOption(option);
    setOpen(false);

    if (!onSelectChange) return;
    onSelectChange?.(option);
  };

  const handleSearchOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = event.target.value;

    if (!onSearchChange) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(newSearchValue);
    }, 500);
  };

  return (
    <div className="relative w-full">
      <div className={selectContainerStyles} onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-center">
          {isLoading ? <LoadingLoader className="mr-4" /> : selectedOption.icon}
          <div>
            <p>{selectedOption.label}</p>
            <p>{selectedOption.subLabel}</p>
          </div>
        </div>
        {open && <DropIcon className="-rotate-90" />}
        {!open && <DropIcon />}
      </div>

      {open && !isLoading && (
        <div className={selectOptionStyles}>
          <div className="m-2">
            <CustomInput
              prefix={<img src={SearchIcon} className="mx-2" alt="search-icon" />}
              onChange={handleSearchOption}
              placeholder="Search"
            />
          </div>
          <div className="overflow-y-auto max-h-60 ">
            {options.map((option, index) => (
              <div
                onClick={() => handleSelectOption(option)}
                key={index}
                className="flex items-center justify-start p-3 cursor-pointer hover:bg-blue-600"
              >
                {option?.icon}
                <div>
                  <p>{option.label}</p>
                  <p>{option?.subLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const selectContainerStyles = clsx(
  "flex",
  "justify-between",
  "items-center",
  "p-2",
  "bg-[#211E49]",
  "border-2",
  "rounded-md",
  "mt-2 border-[#3C3867]",
  "cursor-pointer",
  "px-4",
);

const selectOptionStyles = clsx(
  "absolute",
  "bg-[#151331]",
  "z-20",
  "w-full",
  "mt-2",
  "rounded-sm border",
  "border-[#33B0EC]",
);
