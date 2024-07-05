import { useAppDispatch } from "@redux/Store";
import { Service } from "@redux/models/ServiceModels";
import { editServiceName, removeService } from "@redux/services/ServiceReducer";
import { ChangeEvent, useEffect, useState } from "react";
import { db } from "@/database/db";

export default function useServicesList(newService: boolean) {
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
      dispatch(editServiceName(editedService));
      setSelectedService("");
    }
  }
  function onClose() {
    setEditedService(undefined);
    setSelectedService("");
  }
  async function onDeleteService(srv: Service) {
    await db().deleteService(srv.principal);
    dispatch(removeService(srv.principal));
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

  useEffect(() => {
    if (newService) {
      setSelectedService("");
      setOpenService("");
      setEditedService(undefined);
      setEditedServiceErr({
        name: false,
        principal: false,
      });
      setAddService(true);
    }
  }, [newService]);

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
    onDeleteService,
  };
}
