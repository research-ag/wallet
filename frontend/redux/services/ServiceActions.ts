import { Actor, HttpAgent } from "@dfinity/agent";
import store from "@redux/Store";
import { _SERVICE as IcrcxActor } from "@candid/icrcx/service.did";
import { idlFactory as IcrcxIDLFactory } from "@candid/icrcx/candid.did";
import { ServiceAsset, ServiceData } from "@redux/models/ServiceModels";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { getMetadataInfo } from "@common/utils/icrc";
import { Principal } from "@dfinity/principal";
import { db } from "@/database/db";

export const getServicesData = async (userAgent?: HttpAgent) => {
  const myAssets = store.getState().asset.list.assets;
  const snsAssets = store.getState().asset.utilData.icr1SystemAssets;
  const serviceData = await db().getServices();

  const myAgent = userAgent || store.getState().auth.userAgent;

  const filterAssets: ServiceAsset[] = [];
  const services = await Promise.all(
    serviceData.map(async (srv) => {
      const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
        agent: myAgent,
        canisterId: srv.principal,
      });
      const assetsData = srv.assets;

      let serviceAssets: ServiceAsset[] = [];
      try {
        const supportedAssets = await serviceActor.icrc84_supported_tokens();
        if (supportedAssets.length > 0) {
          const credits = await serviceActor.icrc84_all_credits();
          serviceAssets = await Promise.all(
            supportedAssets.map(async (ast) => {
              const tokenInfo = await serviceActor.icrc84_token_info(ast);

              const asset = myAssets.find((myAst) => myAst.address === ast.toText());
              const snsAsset = snsAssets.find((myAst) => myAst.address === ast.toText());
              const assetData = assetsData.find((myAst) => myAst.principal === ast.toText());
              const credit = credits.find((crd) => crd[0].toText() === ast.toText());

              const serviceAsset: ServiceAsset = {
                tokenSymbol: "",
                tokenName: "",
                logo: "",
                decimal: "",
                shortDecimal: "",
                balance: "",
                principal: ast.toText(),
                credit: credit ? credit[1].toString() : "",
                depositFee: tokenInfo.deposit_fee.toString(),
                withdrawFee: tokenInfo.withdrawal_fee.toString(),
                visible: false,
              };

              const balance = (await serviceActor.icrc84_trackedDeposit(ast)) as any;

              serviceAsset.balance = (balance.Ok as any) ? balance.Ok.toString() : "";
              if (assetData) {
                serviceAsset.tokenSymbol = assetData.tokenSymbol;
                serviceAsset.tokenName = assetData.tokenName;
                serviceAsset.decimal = assetData.decimal;
                serviceAsset.shortDecimal = assetData.shortDecimal;
                serviceAsset.logo = assetData.logo;
                serviceAsset.visible = true;
              } else if (asset) {
                serviceAsset.tokenSymbol = asset.symbol;
                serviceAsset.tokenName = asset.name;
                serviceAsset.decimal = asset.decimal;
                serviceAsset.shortDecimal = asset.shortDecimal;
                serviceAsset.logo = asset.logo || "";
              } else if (snsAsset) {
                serviceAsset.tokenSymbol = snsAsset.tokenSymbol;
                serviceAsset.tokenName = snsAsset.tokenName;
                serviceAsset.decimal = snsAsset.decimal;
                serviceAsset.shortDecimal = snsAsset.shortDecimal;
                serviceAsset.logo = snsAsset.logo || "";
              } else {
                const { metadata } = IcrcLedgerCanister.create({
                  agent: myAgent,
                  canisterId: ast,
                });

                const myMetadata = await metadata({ certified: false });
                const { decimals, name, symbol, logo } = getMetadataInfo(myMetadata);
                serviceAsset.tokenSymbol = symbol;
                serviceAsset.tokenName = name;
                serviceAsset.decimal = decimals.toFixed();
                serviceAsset.shortDecimal = decimals.toFixed();
                serviceAsset.logo = logo || "";
              }
              const filterAsset = filterAssets.find((fAsst) => fAsst.principal === ast.toText());
              if (filterAsset) {
                const index = filterAssets.indexOf(filterAsset);
                if (filterAsset.visible) filterAssets[index].visible = true;
              } else {
                filterAssets.push(serviceAsset);
              }
              return serviceAsset;
            }),
          );
        }
      } catch (error) {
        console.error("service-err", error);
      }

      return {
        name: srv.name,
        principal: srv.principal,
        assets: serviceAssets,
      };
    }),
  );

  return { services, serviceData, filterAssets };
};

export const getServiceData = async (myAgent: HttpAgent, servicePrincipal: string) => {
  const myAssets = store.getState().asset.list.assets;
  const snsAssets = store.getState().asset.utilData.icr1SystemAssets;
  try {
    const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
      agent: myAgent,
      canisterId: servicePrincipal,
    });
    const supportedAssets = await serviceActor.icrc84_supported_tokens();

    let serviceAssets: ServiceAsset[] = [];
    if (supportedAssets.length > 0) {
      const credits = await serviceActor.icrc84_all_credits();
      serviceAssets = await Promise.all(
        supportedAssets.map(async (ast) => {
          const tokenInfo = await serviceActor.icrc84_token_info(ast);

          const asset = myAssets.find((myAst) => myAst.address === ast.toText());
          const snsAsset = snsAssets.find((myAst) => myAst.address === ast.toText());
          const credit = credits.find((crd) => crd[0] === ast);

          const serviceAsset: ServiceAsset = {
            tokenSymbol: "",
            tokenName: "",
            logo: "",
            decimal: "",
            shortDecimal: "",
            balance: "",
            principal: ast.toText(),
            credit: credit ? credit[1].toString() : "",
            depositFee: tokenInfo.deposit_fee.toString(),
            withdrawFee: tokenInfo.withdrawal_fee.toString(),
            visible: false,
          };

          const balance = (await serviceActor.icrc84_trackedDeposit(ast)) as any;
          serviceAsset.balance = (balance.Ok as any) ? balance.Ok.toString() : "";
          if (asset) {
            serviceAsset.tokenSymbol = asset.symbol;
            serviceAsset.tokenName = asset.name;
            serviceAsset.decimal = asset.decimal;
            serviceAsset.shortDecimal = asset.shortDecimal;
            serviceAsset.logo = asset.logo || "";
          } else if (snsAsset) {
            serviceAsset.tokenSymbol = snsAsset.tokenSymbol;
            serviceAsset.tokenName = snsAsset.tokenName;
            serviceAsset.decimal = snsAsset.decimal;
            serviceAsset.shortDecimal = snsAsset.shortDecimal;
            serviceAsset.logo = snsAsset.logo || "";
          } else {
            const { metadata } = IcrcLedgerCanister.create({
              agent: myAgent,
              canisterId: ast,
            });

            const myMetadata = await metadata({ certified: false });
            const { decimals, name, symbol, logo } = getMetadataInfo(myMetadata);
            serviceAsset.tokenSymbol = symbol;
            serviceAsset.tokenName = name;
            serviceAsset.decimal = decimals.toFixed();
            serviceAsset.shortDecimal = decimals.toFixed();
            serviceAsset.logo = logo || "";
          }
          return serviceAsset;
        }),
      );
    }
    return serviceAssets;
  } catch (e: any) {
    return e;
  }
};

export const testServicePrincipal = async (myAgent: HttpAgent, servicePrincipal: string) => {
  try {
    const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
      agent: myAgent,
      canisterId: servicePrincipal,
    });
    await serviceActor.icrc84_supported_tokens();
    return true;
  } catch (e) {
    console.log("e", e);

    return false;
  }
};

export const notifyServiceAsset = async (myAgent: HttpAgent, servicePrincipal: string, assetPrincipal: string) => {
  try {
    const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
      agent: myAgent,
      canisterId: servicePrincipal,
    });
    const res = await serviceActor.icrc84_notify({ token: Principal.fromText(assetPrincipal) });
    return res;
  } catch (e) {
    console.error("Notify Err:", e);
    return { Err: { CallLedgerError: "Action Error" } };
  }
};

export const getCreditBalance = async (
  myAgent: HttpAgent,
  servicePrincipal: string,
  assetPrincipal: string,
): Promise<{ credit: string | undefined; balance: string | undefined }> => {
  try {
    const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
      agent: myAgent,
      canisterId: servicePrincipal,
    });
    const credit = await serviceActor.icrc84_credit(Principal.fromText(assetPrincipal));
    const balance = (await serviceActor.icrc84_trackedDeposit(Principal.fromText(assetPrincipal))) as any;
    return { credit: credit.toString(), balance: balance.Ok ? (balance.Ok.toString() as string) : undefined };
  } catch (e) {
    console.error("Notify Err:", e);
    return { credit: undefined, balance: undefined };
  }
};

export const saveServices = async (services: ServiceData[]) => {
  await db().setServices(services);
};
