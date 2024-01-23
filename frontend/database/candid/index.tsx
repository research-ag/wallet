import { Actor, HttpAgent, ActorSubclass, HttpAgentOptions, ActorConfig, Agent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Imports and re-exports candid interface
import { _SERVICE, idlFactory } from "./db";

interface CreateActorOptions {
  /**
   * @see {@link Agent}
   */
  agent?: Agent;
  /**
   * @see {@link HttpAgentOptions}
   */
  agentOptions?: HttpAgentOptions;
  /**
   * @see {@link ActorConfig}
   */
  actorOptions?: ActorConfig;
}

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */
export const canisterId = import.meta.env.VITE_CANISTER_ID_DB || import.meta.env.VITE_DB_CANISTER_ID;

/**
 * Intialized Actor using default settings, ready to talk to a canister using its candid interface
 * @constructs {@link ActorSubClass}
 */
export const createActor = (
  canisterId: string | Principal,
  options: CreateActorOptions = {},
): ActorSubclass<_SERVICE> => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.",
    );
  }

  // Fetch root key for certificate validation during development
  if (import.meta.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const db = createActor(canisterId);
