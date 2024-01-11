import { useState } from "react";

export interface IUseContactFilters {
  assetOpen: boolean;
  addOpen: boolean;
  searchKey: string;
  assetFilter: string[];
  setAssetOpen: (open: boolean) => void;
  setAddOpen: (open: boolean) => void;
  setSearchKey: (key: string) => void;
  setAssetFilter: (filter: string[]) => void;
}

export default function useContactFilters(): IUseContactFilters {
  const [assetOpen, setAssetOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [assetFilter, setAssetFilter] = useState<string[]>([]);

  return {
    assetOpen,
    addOpen,
    searchKey,
    assetFilter,
    setAssetOpen,
    setAddOpen,
    setSearchKey,
    setAssetFilter,
  };
}
