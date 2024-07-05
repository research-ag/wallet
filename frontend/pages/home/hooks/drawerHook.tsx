import { useAppDispatch } from "@redux/Store";
import { useEffect, useState } from "react";
import { setBlur } from "@redux/auth/AuthReducer";
import { DrawerOption, DrawerOptionEnum } from "@/common/const";

export const DrawerHook = () => {
  const dispatch = useAppDispatch();

  const [assetOpen, setAssetOpen] = useState<boolean>(false);

  const [drawerOption, setDrawerOption] = useState<DrawerOption>(DrawerOptionEnum.Enum.SEND);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!assetOpen && !drawerOpen) dispatch(setBlur(false));
    else dispatch(setBlur(true));
  }, [assetOpen, drawerOpen]);

  return {
    assetOpen,
    setAssetOpen,
    drawerOption,
    setDrawerOption,
    drawerOpen,
    setDrawerOpen,
  };
};
