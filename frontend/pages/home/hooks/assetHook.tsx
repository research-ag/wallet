<<<<<<< HEAD
import { useState } from "react";
import { SubAccount } from "@redux/models/AccountModels";
=======
import { defaultTokens } from "@/defaultsTokens";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { updateAllBalances } from "@redux/assets/AssetActions";
import {
  removeToken,
  setAcordeonAssetIdx,
  setLoading,
  setSelectedAccount,
  setSelectedAsset,
} from "@redux/assets/AssetReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { Token } from "@redux/models/TokenModels";
import { useEffect, useState } from "react";
>>>>>>> 5f285087 (clean code for deployment)

export const AssetHook = () => {
  const [editNameId, setEditNameId] = useState("");
  const [name, setName] = useState("");
  const [newSub, setNewSub] = useState<SubAccount | undefined>();
  const [hexChecked, setHexChecked] = useState<boolean>(false);

  return {
    editNameId,
    setEditNameId,
    name,
    setName,
    newSub,
    setNewSub,
    hexChecked,
    setHexChecked,
  };
};
