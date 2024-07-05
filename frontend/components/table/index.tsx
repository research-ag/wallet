import { clsx } from "clsx";
import { ReactNode } from "react";

interface CommonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Table({ children, className }: CommonProps) {
  return (
    <table
      className={`${className} w-full relative flex flex-col overflow-y-scroll  max-h-[calc(90vh-11.25rem)] scroll-y-light`}
    >
      {children}
    </table>
  );
}

export function TableHead({ children, className }: CommonProps) {
  return (
    <thead className={`sticky top-0 border-b border-BorderColorTwoLight dark:border-BorderColorTwo ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: CommonProps) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className }: CommonProps) {
  return <tr className={`${className}`}>{children}</tr>;
}

export function TableHeaderCell({ children, className }: CommonProps) {
  return <th className={`${className} p-2 text-md text-left`}>{children}</th>;
}

export function TableBodyCell({ children, className, disabled }: CommonProps) {
  return <td className={`${className}  ${getTableBodyStyles(disabled)} py-2 text-left`}>{children}</td>;
}

function getTableBodyStyles(disabled = false) {
  return clsx(disabled ? "text-PrimaryTextColorLight/50 dark:text-PrimaryTextColor/50" : "", "py-2 text-left");
}
