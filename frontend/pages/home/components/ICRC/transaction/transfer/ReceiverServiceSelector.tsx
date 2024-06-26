import { BasicSelect } from "@components/select";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ServiceSubAccount } from "@/@types/transactions";
import { AvatarEmpty } from "@components/avatar";
import { SelectOption } from "@/@types/components";
import { useAppSelector } from "@redux/Store";
import { Principal } from "@dfinity/principal";
import { Buffer } from "buffer";
import { useTransfer } from "@pages/home/contexts/TransferProvider";
import { Asset } from "@redux/models/AccountModels";
import logger from "@/common/utils/logger";
import { CustomInput } from "@components/input";
import BeneficiaryContactBook from "./BeneficiaryContactBook";
import { Contact } from "@redux/models/ContactsModels";
import ReceiverContactBeneficiarySelector from "./ReceiverContactBeneficiarySelector";

export default function ServiceBookReceiver() {
  const { transferState, setTransferState } = useTransfer();
  const [searchSubAccountValue, setSearchSubAccountValue] = useState<string | null>(null);
  const { authClient } = useAppSelector((state) => state.auth);
  const { services } = useAppSelector((state) => state.services);
  const { contacts } = useAppSelector((state) => state.contacts);
  const assets = useAppSelector((state) => state.asset.list.assets);
  const [benefErr, setBenefErr] = useState(false);
  const [beneficiary, setBeneficiary] = useState(authClient);
  const [contactBeneficiary, setContactBeneficiary] = useState<Contact>();

  useEffect(() => {
    const auxContact = contacts.find((contact) => {
      const princBytes = Principal.fromText(contact.principal).toUint8Array();
      const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
      return princSubId === transferState.toSubAccount;
    });
    if (auxContact) setContactBeneficiary(auxContact);
    else setBeneficiary(authClient);
  }, []);

  const filteredServices: ServiceSubAccount[] = useMemo(() => {
    if (!services || !services.length) return [];
    const auxServices: ServiceSubAccount[] = [];
    const currentAsset = assets.find((asset) => asset.tokenSymbol === transferState.tokenSymbol) as Asset;

    for (let serviceIndex = 0; serviceIndex < services.length; serviceIndex++) {
      const currentService = services[serviceIndex];

      const currentServiceAsset = currentService?.assets?.find((asset) => asset.principal === currentAsset.address);

      const isAssetVisible = currentService.assets.find(
        (ast) => ast.principal === currentAsset?.address && ast.visible,
      );

      const princBytes = Principal.fromText(authClient).toUint8Array();
      const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

      if (currentServiceAsset && isAssetVisible)
        auxServices.push({
          serviceName: currentService.name,
          servicePrincipal: currentService.principal,
          assetLogo: currentAsset.logo,
          assetSymbol: currentAsset.symbol,
          assetTokenSymbol: currentAsset.tokenSymbol,
          assetAddress: currentAsset.address,
          assetDecimal: currentAsset.decimal,
          assetShortDecimal: currentAsset.shortDecimal,
          assetName: currentAsset.name,
          subAccountId: princSubId,
          minDeposit: currentServiceAsset.minDeposit,
          minWithdraw: currentServiceAsset.minWithdraw,
          depositFee: currentServiceAsset.depositFee,
          withdrawFee: currentServiceAsset.withdrawFee,
        });
    }
    return auxServices;
  }, [transferState, services]);

  const formattedServices = useMemo(() => {
    if (!searchSubAccountValue) return filteredServices.map(formatService);
    return filteredServices
      .filter((srv) => {
        return srv.serviceName.toLocaleLowerCase().includes(searchSubAccountValue);
      })
      .map(formatService);
  }, [filteredServices, searchSubAccountValue]);

  return (
    <div className="flex flex-col justify-start items-start gap-2 mx-4">
      <BasicSelect
        onSelect={onSelect}
        options={formattedServices}
        initialValue={transferState.toPrincipal}
        currentValue={transferState.toPrincipal}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="21rem"
      />
      {contactBeneficiary ? (
        <ReceiverContactBeneficiarySelector
          setBeneficiary={setBeneficiary}
          selectedContact={contactBeneficiary}
          setSelectedContact={setContactBeneficiary}
        />
      ) : (
        <CustomInput
          intent="primary"
          value={beneficiary}
          sufix={<BeneficiaryContactBook setSelectedContact={setContactBeneficiary} />}
          border={benefErr ? "error" : "primary"}
          sizeInput={"small"}
          onChange={onInputChange}
          autoFocus
        />
      )}
    </div>
  );

  function formatService(srv: ServiceSubAccount) {
    return {
      value: srv.servicePrincipal,
      label: `${srv.serviceName}`,
      subLabel: srv.servicePrincipal,
      icon: <AvatarEmpty title={srv.serviceName} size="medium" className="mr-4" />,
    };
  }

  function onSelect(option: SelectOption) {
    setSearchSubAccountValue(null);

    const fullService = filteredServices?.find((srv) => srv.servicePrincipal === option.value);

    if (!fullService) {
      logger.debug("ReceiverServiceSelector: onSelect: fullService is null");
      return;
    }

    const princBytes = Principal.fromText(authClient).toUint8Array();
    const toSubaccount = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;

    setTransferState((prevState) => ({
      ...prevState,
      toPrincipal: fullService.servicePrincipal,
      toSubaccount,
    }));
    setContactBeneficiary;
  }

  function onSearchChange(searchValue: string) {
    setSearchSubAccountValue(searchValue);
  }

  function onOpenChange() {
    setSearchSubAccountValue(null);
  }
  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setBeneficiary(e.target.value.trim());
    try {
      const prin = Principal.fromText(e.target.value.trim());
      setBenefErr(false);
      const princBytes = prin.toUint8Array();
      const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
      setTransferState((prev) => ({
        ...prev,
        toSubAccount: princSubId,
      }));
    } catch {
      setBenefErr(true);
      setTransferState((prev) => ({
        ...prev,
        toSubAccount: "err",
      }));
    }
  }
}
