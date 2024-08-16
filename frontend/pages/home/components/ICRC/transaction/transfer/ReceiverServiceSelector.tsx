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
import { t } from "i18next";
import { hexStringToPrincipal } from "@common/utils/unitArray";

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
    let auxContact = contacts.find((contact) => {
      const princBytes = Principal.fromText(contact.principal).toUint8Array();
      const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
      return princSubId === transferState.toSubAccount;
    });

    const selfPrincBytes = Principal.fromText(authClient).toUint8Array();
    const selfPrincSubId = `0x${selfPrincBytes.length.toString(16) + Buffer.from(selfPrincBytes).toString("hex")}`;

    if (selfPrincSubId === transferState.toSubAccount) {
      auxContact = {
        name: t("self"),
        principal: authClient,
        accountIdentifier: "",
        accounts: [],
      };
    }

    if (auxContact) setContactBeneficiary(auxContact);
    else setBeneficiary(hexStringToPrincipal(transferState.toSubAccount).toText());
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
    <div className="flex flex-col justify-start items-start mx-4">
      <p className="mt-2 text-md text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/60">{t("service")}</p>
      <BasicSelect
        onSelect={onSelect}
        options={formattedServices}
        initialValue={transferState.toPrincipal}
        currentValue={transferState.toPrincipal}
        onSearch={onSearchChange}
        onOpenChange={onOpenChange}
        componentWidth="21rem"
        margin="!mt-0"
      />
      <p className="mt-2 text-md text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/60">{t("beneficiary")}</p>
      {contactBeneficiary ? (
        <ReceiverContactBeneficiarySelector
          setBeneficiary={setBeneficiary}
          selectedContact={contactBeneficiary}
          setSelectedContact={setContactBeneficiary}
          onSelectOption={onSelectOption}
        />
      ) : (
        <CustomInput
          intent="primary"
          value={beneficiary}
          sufix={
            <div className="flex flex-row justify-between items-center gap-1 pl-1">
              <button className="p-0" onClick={onSelf}>
                <p className="text-sm text-slate-color-info underline">{t("self")}</p>
              </button>
              <BeneficiaryContactBook onSelectContactBeneficiaty={onSelectContactBeneficiaty} />
            </div>
          }
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
  function onSelf() {
    setBenefErr(false);
    setBeneficiary(authClient);
    const princBytes = Principal.fromText(authClient).toUint8Array();
    const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    setTransferState((prev) => ({
      ...prev,
      toSubAccount: princSubId,
    }));

    setContactBeneficiary({
      name: t("self"),
      principal: authClient,
      accountIdentifier: "",
      accounts: [],
    });
  }
  function onSelectOption(option: SelectOption) {
    let contact = contacts.find((contact) => `${contact.principal}` === option.value);

    if (option.value === authClient && option.label === t("self")) {
      contact = {
        name: t("self"),
        principal: authClient,
        accountIdentifier: "",
        accounts: [],
      };
    }

    if (!contact) {
      logger.debug("ReceiverContactSelector: onSelect: contact not found");
      return;
    }

    const princBytes = Principal.fromText(contact.principal).toUint8Array();
    const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    setTransferState((prev) => ({
      ...prev,
      toSubAccount: princSubId,
    }));
    setContactBeneficiary(contact);
  }

  function onSelectContactBeneficiaty(contact: Contact) {
    const princBytes = Principal.fromText(contact.principal).toUint8Array();
    const princSubId = `0x${princBytes.length.toString(16) + Buffer.from(princBytes).toString("hex")}`;
    setTransferState((prev) => ({
      ...prev,
      toSubAccount: princSubId,
    }));
    setContactBeneficiary(contact);
  }
}
