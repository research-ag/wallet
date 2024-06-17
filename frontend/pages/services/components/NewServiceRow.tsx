// svg
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
//
import { CustomInput } from "@components/input";
import useNewServices from "@/pages/services/hooks/useNewService";
import { useState } from "react";
import { LoadingLoader } from "@components/loader";

interface NewServiceRowProps {
  setAddService(value: boolean): void;
  setNewService(value: boolean): void;
}

export const NewServiceRow = (props: NewServiceRowProps) => {
  const { setAddService, setNewService } = props;
  const {
    newService,
    newServiceErr,
    onServiceNameChange,
    onServicePrincipalChange,
    saveService,
    setNewServiceErr,
    showDuplicate,
    setShowDuplicate,
  } = useNewServices();
  const [loading, setLoading] = useState(false);
  return (
    <tr className="border-b border-BorderColorTwoLight dark:border-BorderColorTwo bg-SelectRowColor/10">
      <td>
        <div className="relative flex flex-row items-center justify-start w-full gap-2 px-4 min-h-14">
          <div className="absolute left-0 w-1 h-14 bg-SelectRowColor"></div>
          <CustomInput
            intent={"primary"}
            border={newServiceErr.name ? "error" : "primary"}
            sizeComp={"xLarge"}
            sizeInput="small"
            value={newService.name}
            onChange={onServiceNameChange}
            autoFocus
            className="w-[18rem]"
          />
        </div>
      </td>
      <td>
        <CustomInput
          intent={"primary"}
          border={newServiceErr.principal ? "error" : "primary"}
          sizeComp={"xLarge"}
          sizeInput="small"
          value={newService.principal}
          onChange={onServicePrincipalChange}
          sufix={showDuplicate ? <p className="text-sm text-slate-color-error">Duplicate</p> : <></>}
          className="!w-[18rem]"
        />
      </td>
      <td>
        {loading ? (
          <LoadingLoader />
        ) : (
          <div className="flex flex-row items-center justify-center gap-2">
            <CheckIcon
              onClick={onSave}
              className="w-4 h-4 cursor-pointer opacity-80 dark:stroke-secondary-color-1-light stroke-secondary-color-2"
            />
            <CloseIcon
              onClick={onClose}
              className="w-5 h-5 cursor-pointer opacity-80 dark:stroke-secondary-color-1-light stroke-secondary-color-2"
            />
          </div>
        )}
      </td>
      <td></td>
    </tr>
  );

  function onClose() {
    setAddService(false);
    setNewService(false);
  }
  async function onSave() {
    if (!loading) {
      setLoading(true);
      const res = await saveService();
      if (res.success) onClose();
      else {
        if (res.err === "service-name-data-err")
          setNewServiceErr((prev: any) => {
            return { name: true, principal: prev.principal };
          });
        else {
          setNewServiceErr((prev: any) => {
            return { name: prev.name, principal: true };
          });
          if (res.err === "service-duplicate-err") {
            setShowDuplicate(true);
          }
        }
      }

      setLoading(false);
    }
  }
};
