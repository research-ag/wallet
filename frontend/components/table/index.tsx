import React, { ReactNode } from "react";

interface CommonProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: CommonProps) {
  return <table className={`${className} w-full`}>{children}</table>;
}

export const TableHead = ({ children, className }: CommonProps) => {
  return <thead className={`${className} border-b border-[#2b2759]`}>{children}</thead>;
};

export const TableBody = ({ children, className }: CommonProps) => {
  return <tbody className={className}>{children}</tbody>;
};

export const TableRow = ({ children, className }: CommonProps) => {
  return <tr className={`${className} border-b border-[#2b2759] text-md`}>{children}</tr>;
};

export const TableHeaderCell = ({ children, className }: CommonProps) => {
  return <th className={`${className} py-2 text-lg text-left`}>{children}</th>;
};

export const TableBodyCell = ({ children, className }: CommonProps) => {
  return <td className={`${className} py-2 text-left`}>{children}</td>;
};
