// svg
import { ReactComponent as PlusIcon } from "@assets/svg/files/plus-icon.svg";
//
import { memo, useState } from "react";
import { IconButton } from "@components/button";

function AddServiceModal() {
  console.log("AddServiceModal");
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div>
      <IconButton icon={<PlusIcon className="w-6 h-6" />} size="medium" onClick={() => setAddOpen(true)} />
      {addOpen && <div>Modal</div>}
    </div>
  );
}

export default memo(AddServiceModal);
