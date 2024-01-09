import { useRef, useState } from "react";

export default function useSpenderFormItem() {
  const [search, setSearch] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const inputTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const onSearchChange = (searchValue: string) => setSearch(searchValue);
  const onOpenChange = () => setSearch(null);

  return {
    search,
    isNew,
    inputTimeoutRef,
    setSearch,
    setIsNew,
    onSearchChange,
    onOpenChange,
  };
}
