import clsx from "clsx";
import { useState } from "react";

interface SwitchProps {
  onSwitchChange: (isChecked: boolean) => void;
  checked?: boolean;
  className?: string;
}

// TODO JULIO: remove hard code colors
export default function Switch(props: SwitchProps) {
  const { onSwitchChange, className, checked = true } = props;
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isCheckedValue = event.target.checked;
    setIsChecked(isCheckedValue);
    onSwitchChange(isCheckedValue);
  };

  return (
    <label className={switchContainerStyles(className)}>
      <input
        type="checkbox"
        className="absolute appearance-none peer"
        onChange={handleSwitchChange}
        checked={isChecked}
      />

      <span className={checkboxStyles}></span>
    </label>
  );
}

const switchContainerStyles = (customClassName?: string) =>
  clsx("relative p-0 m-0 cursor-pointer w-fit", customClassName);

const checkboxStyles = clsx(
  "flex absolute items-center flex-shrink-0 w-7 h-4 p-1 ml-4 bg-[#7E7D91]",
  "rounded-full after:w-3 after:h-3 after:bg-white after:rounded-full after:shadow-md",
  "peer-checked:bg-green-400 duration-300 ease-in-out",
  "after:duration-300 peer-checked:after:translate-x-2",
);
