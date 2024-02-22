import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/Store";
import { setDbLocation } from "@/redux/auth/AuthReducer";

export const DbLocationHook = () => {
  const dispatch = useAppDispatch();
  const [dbLocationOpen, setDbLocationOpen] = useState(false);

  const { dbLocation } = useAppSelector((state) => state.auth);

  const changeDbLocation = (value: string) => dispatch(setDbLocation(value));

  return { dbLocation, changeDbLocation, dbLocationOpen, setDbLocationOpen };
};
