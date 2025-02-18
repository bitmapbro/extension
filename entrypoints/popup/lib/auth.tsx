import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "wxt/storage";

import { decrypt, derive, encrypt } from "./derive";
import { store } from "./store";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const [challenge, setChallenge] = useState<string | undefined>();
  const [cipher, setCipher] = useState<CryptoKey | null>(null);
  const [verifier, setVerifier] = useState<string>("");
  const [passphrase, setPassphrase] = useState<string>("");
  const [hasSignedIn, setHasSignedIn] = useState<boolean>(false);
  const [hasSignedUp, setHasSignedUp] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);

  if (!challenge) {
  }

  const resetWallet = async () => {
    await Promise.all([
      storage.removeItem(`local:${store.verifier}`),
      storage.removeItem(`local:${store.mnemonic}`),
    ]);
    setPassphrase("");
    setCipher(null);
    setVerifier("");
    setHasSignedIn(false);
    setHasSignedUp(false);
  };

  const signIn = async (email: string, password: string) => {
    const { encrypter } = await derive(email, password);
    if (!encrypter) {
      setCipher(null);
      return false;
    }
    let output = "";
    try {
      output = await decrypt(encrypter, verifier);
    } catch {}
    if (output !== challenge) {
      setCipher(null);
      return false;
    }
    setCipher(encrypter);
    const mnemonic = await storage.getItem<string>(`local:${store.mnemonic}`);
    if (mnemonic) {
      const decodedPassphrase = await decrypt(encrypter, mnemonic);
      setPassphrase(decodedPassphrase);
    }
    return true;
  };

  const signOut = async () => setCipher(null);

  const signUp = async (email: string, password: string): Promise<void> => {
    if (!challenge) {
      throw new Error("no challenge");
    }
    const { encrypter } = await derive(email, password);
    const output = await encrypt(encrypter, challenge);
    await storage.setItem(`local:${store.verifier}`, output);
    setVerifier(output);
  };

  const savePassphrase = async (decodedPassphrase: string) => {
    if (!cipher) {
      throw new Error("no cipher");
    }
    const output = await encrypt(cipher, decodedPassphrase);
    await storage.setItem(`local:${store.mnemonic}`, output);
    setPassphrase(decodedPassphrase);
  };

  useEffect(() => {
    (async () => {
      let challenge = await storage.getItem<string>(`local:${store.challenge}`);
      if (!challenge) {
        challenge = self.crypto.randomUUID();
        await storage.setItem(`local:${store.challenge}`, challenge);
      }
      setChallenge(challenge);
      setVerifier(
        (await storage.getItem<string>(`local:${store.verifier}`)) ?? ""
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (verifier) {
        setHasSignedUp(true);
      } else {
        setHasSignedUp(false);
      }
      if (cipher) {
        setHasSignedIn(true);
      } else {
        setHasSignedIn(false);
      }
      challenge && setAuthReady(true);
    })();
  }, [verifier, challenge, cipher]);

  return (
    <AuthContext.Provider
      value={{
        authReady,
        hasSignedIn,
        hasSignedUp,
        passphrase,
        resetWallet,
        savePassphrase,
        signIn,
        signOut,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<{
  authReady: boolean;
  hasSignedIn: boolean;
  hasSignedUp: boolean;
  passphrase: string;
  resetWallet: () => void;
  savePassphrase: (value: string) => void;
  signIn: (e: string, p: string) => void;
  signOut: () => void;
  signUp: (e: string, p: string) => void;
}>({
  authReady: false,
  hasSignedIn: false,
  hasSignedUp: false,
  passphrase: "",
  resetWallet: () => {},
  savePassphrase: () => {},
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
