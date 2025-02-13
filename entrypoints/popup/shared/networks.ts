import { shortString } from "starknet";

export default [
  {
    id: "devnet",
    name: "Devnet",
    rpcUrl: "http://localhost:5050/rpc",
    chainId: shortString.encodeShortString("SN_SEPOLIA"), // "0x534e5f5345504f4c4941"
    tokenAddress:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    tokenName: "STARK",
  },
  {
    id: "mainnet-alpha",
    name: "Mainnet",
    chainId: shortString.encodeShortString("SN_MAIN"),
    rpcUrl: "https://cloud.argent-api.com/v1/starknet/mainnet/rpc/v0.5",
    // FIXME update it
    tokenAddress:
      "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    tokenName: "STARK",
  },
];
