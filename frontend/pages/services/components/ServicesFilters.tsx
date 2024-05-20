import { memo } from "react";
import AddServiceModal from "./AddServiceModal";

interface ServicesFiltersProps {
  onServiceKeyChange: (key: string) => void;
}

function ServicesFilters({ onServiceKeyChange }: ServicesFiltersProps) {
  return (
    <div>
      <p>ServicesFilters</p>
      <input type="text" placeholder="Search Services" onChange={(e) => onServiceKeyChange(e.target.value)} />
      <AddServiceModal />
    </div>
  );
}

export default memo(ServicesFilters);
