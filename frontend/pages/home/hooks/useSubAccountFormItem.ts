import { useState } from "react";

export default function useSubAccountFormItem() {
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const onOpenChange = () => setSearchValue(null);

  const onSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
  };
  return { searchValue, setSearchValue, onOpenChange, onSearchChange };
}
