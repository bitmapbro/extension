import { generateMnemonic } from "@scure/bip39";
import { wordlist as en } from "@scure/bip39/wordlists/english";
import { storage } from "wxt/storage";

const fifteenMinutes = 15 * 60 * 1000;

// export async function Reset(): Promise<void> {
//   await Promise.all([storage.clear("local"), storage.clear("session")]);
// }

// export async function Signin(
//   email: string,
//   password: string
// ): Promise<boolean> {
//   console.log("Signin 1");
//   const { verify } = useAuth();
//   console.log("Signin 2");
//   const { encrypter } = await derive(email, password);
//   if (!(await verify(encrypter))) {
//     return false;
//   }
//   await storage.setItem("session:signedInUntil", Date.now() + fifteenMinutes);
//   return true;
// }

// export async function Signout(): Promise<void> {
//   await storage.removeItem("session:signedInUntil");
// }

// export async function Signup(
//   email: string,
//   password: string,
//   challenge: string,
//   setVerifier: (value: string) => void
// ): Promise<void> {
//   const { encrypter } = await derive(email, password);
//   const output = await encrypt(encrypter, challenge);
//   await setVerifier(output);
// }

// mnemonics
// export async function GetMnemonic(): Promise<string | null> {
//   return await storage.getItem<string>("local:mnemonic");
// }

// export function GenerateMnemonic(): string {
//   return generateMnemonic(en);
// }
