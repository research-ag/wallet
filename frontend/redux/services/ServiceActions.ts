import { Actor, HttpAgent } from "@dfinity/agent";
import store from "@redux/Store";
import { _SERVICE as IcrcxActor } from "@candid/icrcx/service.did";
import { idlFactory as IcrcxIDLFactory } from "@candid/icrcx/candid.did";
import { ServiceAsset, ServiceData } from "@redux/models/ServiceModels";

export const getServicesData = async (myAgent: HttpAgent, principal: string) => {
  const myAssets = store.getState().asset.list.assets;

  const serviceData = (JSON.parse(localStorage.getItem(`services-${principal}`) || "null") as ServiceData[]) || [];

  const services = await Promise.all(
    serviceData.map(async (srv) => {
      const serviceActor = Actor.createActor<IcrcxActor>(IcrcxIDLFactory, {
        agent: myAgent,
        canisterId: srv.principal,
      });

      let serviceAssets: ServiceAsset[] = [];
      try {
        const supportedAssets = await serviceActor.icrcX_supported_tokens();
        if (supportedAssets.length > 0) {
          const credits = await serviceActor.icrcX_all_credits();
          serviceAssets = await Promise.all(
            supportedAssets.map(async (ast) => {
              const tokenInfo = await serviceActor.icrcX_token_info(ast);

              const asset = myAssets.find((myAst) => myAst.address === ast.toText());
              const credit = credits.find((crd) => crd[0] === ast);

              const serviceAsset: ServiceAsset = {
                tokenSymbol: "",
                balance: "",
                credit: credit ? credit[1].toString() : "",
                minDeposit: tokenInfo.min_deposit.toString(),
                minWithdraw: tokenInfo.min_withdrawal.toString(),
                depositFee: tokenInfo.deposit_fee.toString(),
                withdrawFee: tokenInfo.withdrawal_fee.toString(),
              };
              if (asset) {
                const balance = (await serviceActor.icrcX_trackedDeposit(ast)) as any;
                serviceAsset.tokenSymbol = asset.tokenSymbol;
                serviceAsset.balance = (balance.Ok as any) ? balance.Ok.toString() : "";
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

  return { services, serviceData };
};
