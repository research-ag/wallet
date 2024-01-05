import { ReactNode } from "react";

interface CommonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Table({ children, className }: CommonProps) {
  return (
    <table
      className={`${className} w-full relative p-1 flex flex-col overflow-y-scroll  max-h-[calc(90vh-11.25rem)] scroll-y-light`}
    >
      {children}
    </table>
  );
}

export const TableHead = ({ children, className }: CommonProps) => {
  return <thead className={`${className}`}>{children}</thead>;
};

export const TableBody = ({ children, className }: CommonProps) => {
  return <tbody className={className}>{children}</tbody>;
};

export const TableRow = ({ children, className }: CommonProps) => {
  return <tr className={`${className}`}>{children}</tr>;
};

export const TableHeaderCell = ({ children, className }: CommonProps) => {
  return <th className={`${className} py-2 text-lg text-left`}>{children}</th>;
};

export const TableBodyCell = ({ children, className, disabled }: CommonProps) => {
  return <td className={`${className}  ${disabled ? "opacity-20" : ""} py-2 text-left`}>{children}</td>;
};
