import { useAppDispatch } from "@redux/Store";
import { Service } from "@redux/models/ServiceModels";
import { editService } from "@redux/services/ServiceReducer";
import { ChangeEvent, useState } from "react";

export default function useServicesList() {
  const dispatch = useAppDispatch();

  const [selectedService, setSelectedService] = useState("");
  const [openService, setOpenService] = useState("");
  const [editedService, setEditedService] = useState<Service>();
  const [editedServiceErr, setEditedServiceErr] = useState({
    name: false,
    principal: false,
  });
  const [addService, setAddService] = useState(false);

  function onContactNameChange(e: ChangeEvent<HTMLInputElement>) {
    setEditedService((prev: any) => {
      return { ...prev, name: e.target.value };
    });
    setEditedServiceErr((prev: any) => {
      return { name: e.target.value.trim() === "", principal: prev.principal };
    });
  }
  function onEditService(srv: Service) {
    setEditedService(srv);
    setSelectedService(srv.principal);
    setEditedServiceErr({
      name: false,
      principal: false,
    });
  }
  function onSave() {
    if (editedService && !editedServiceErr.name) {
      dispatch(editService(editedService));
      setSelectedService("");
    }
  }
  function onClose() {
    setEditedService(undefined);
    setSelectedService("");
  }
  function onChevIconClic(srv: Service) {
    if (srv.principal === openService) setOpenService("");
    else {
      if (srv.assets.length > 0) {
        setOpenService(srv.principal);
      }
    }
    if (srv.principal !== selectedService) setSelectedService("");
    setAddService(false);
  }

  return {
    selectedService,
    setSelectedService,
    openService,
    setOpenService,
    editedService,
    setEditedService,
    editedServiceErr,
    setEditedServiceErr,
    addService,
    setAddService,
    //
    onContactNameChange,
    onChevIconClic,
    onEditService,
    onClose,
    onSave,
  };
}
