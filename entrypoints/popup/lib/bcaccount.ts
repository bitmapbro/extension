import { RpcProvider, Account } from "starknet";

export type Config = {
  providerURL: string;
  // The array of provided accounts.
  accounts: AccountConfig[];
};

export type AccountConfig = {
  // The class hash.
  classHash?: string;
  // The address.
  address: string;
  // The private key.
  privateKey: string;
  // The public key.
  publicKey: string;
  // The public key.
  defaultTransactionVersion: "0x2" | "0x3";
};

// export const getAccount = (config: Config): Account => {
//   const provider = new RpcProvider({ nodeUrl: config.providerURL });
//   return new Account(
//     provider,
//     configAccount.address,
//     configAccount.privateKey,
//     "1",
//     configAccount.defaultTransactionVersion
//   );
// };
