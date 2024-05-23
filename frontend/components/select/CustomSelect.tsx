import { useEffect, useRef, useState } from "react";

interface SelectProps<T> {
  triggerComponent: (props: { open: boolean; options: T[]; selectedOption: T }) => JSX.Element;
  contentComponent: (props: { open: boolean; options: T[]; selectedOption: T }) => JSX.Element;
  options: T[];
  selectedOption: T;
}

export default function CustomSelect<T>(props: SelectProps<T>) {
  const { triggerComponent, contentComponent, options, selectedOption } = props;
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectRef]);

  return (
    <div ref={selectRef} className="relative">
      <div onClick={() => setOpen(!open)}>{triggerComponent({ open, options, selectedOption })}</div>
      <div onClick={() => setOpen(!open)}>{contentComponent({ open, options, selectedOption })}</div>
    </div>
  );
}
