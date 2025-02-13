import { useLocation, useNavigate, Navigate } from "react-router";
import { useState, useEffect, useContext, createContext } from "react";
import { decrypt, derive, encrypt } from "./derive";
import { store } from "./store";
import { storage } from "wxt/storage";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const redirect = useNavigate();
  const [challenge, setChallenge] = useState("");
  const [cipher, setCipher] = useState(null as CryptoKey | null);
  const [verifier, setStateVerifier] = useState("");
  const [passphrase, setStatePassphrase] = useState("");
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  const signIn = async (email: string, password: string) => {
    const { encrypter } = await derive(email, password);
    await verify(encrypter);
    setHasSignedIn(true);
  };

  const signOut = async () => {
    setHasSignedIn(false);
    setCipher(null);
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    const { encrypter } = await derive(email, password);
    const output = await encrypt(encrypter, challenge);
    await setVerifier(output);
    setHasSignedUp(true);
  };

  const setPassphrase = async (value: string) => {
    if (!cipher) {
      throw new Error("no cipher");
    }
    const output = await encrypt(cipher, value);
    await storage.setItem(`local:${store.mnemonic}`, output);
    setStatePassphrase(value);
  };

  const setVerifier = async (value: string) => {
    setHasSignedUp(true);
    await storage.setItem(`local:${store.verifier}`, value);
    setStateVerifier(value);
  };

  const verify = async (key: CryptoKey | null): Promise<boolean> => {
    if (!key) {
      setCipher(null);
      return false;
    }
    let output = "";
    try {
      output = await decrypt(key, verifier);
    } catch {
      setCipher(null);
      return false;
    }
    if (output !== challenge) {
      setCipher(null);
      return false;
    }
    setCipher(key);
    setHasSignedIn(true);
    const mnemonic = await storage.getItem<string>(`local:${store.mnemonic}`);
    if (mnemonic) {
      const decodedPassphrase = await decrypt(key, mnemonic);
      setStatePassphrase(decodedPassphrase);
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      const challenge = await storage.getItem<string>(
        `local:${store.challenge}`
      );
      const verifier = await storage.getItem<string>(`local:${store.verifier}`);
      setChallenge(challenge ?? "");
      setStateVerifier(verifier ?? "");
    })();
  });

  useEffect(() => {
    (async () => {
      if (verifier) {
        await storage.setItem(`local:${store.verifier}`, verifier);
        return;
      }
      await Promise.all([
        storage.removeItem(`local:${store.verifier}`),
        storage.removeItem(`local:${store.mnemonic}`),
      ]);
      setStatePassphrase("");
      setHasSignedIn(false);
      setHasSignedUp(false);
      redirect("/signup");
    })();
  }, [verifier]);

  useEffect(() => {
    (async () => {
      if (challenge) {
        return;
      }
      const id = self.crypto.randomUUID();
      await storage.setItem(`local:${store.challenge}`, id);
      setChallenge(id);
    })();
  }, [challenge]);

  useEffect(() => {
    if (verifier && !cipher) {
      setHasSignedIn(false);
      redirect("/signin");
    }
  }, [cipher]);

  const resetWallet = () => setVerifier("");

  return (
    <AuthContext.Provider
      value={{
        challenge,
        cipher,
        hasSignedIn,
        hasSignedUp,
        passphrase,
        resetWallet,
        setPassphrase,
        setVerifier,
        signIn,
        signOut,
        signUp,
        verifier,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({
  children,
}: ProtectedRouteProps): React.ReactNode {
  const { cipher, verifier, passphrase } = useAuth();
  const location = useLocation();
  if (!verifier && location.pathname !== "/signup") {
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }
  if (!cipher && location.pathname !== "/signin") {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  if (
    !passphrase &&
    location.pathname !== "/phrase" &&
    location.pathname !== "/signin" &&
    location.pathname !== "/signup"
  ) {
    return <Navigate to="/phrase" replace state={{ from: location }} />;
  }
  return children;
}

export const AuthContext = createContext<{
  challenge: string;
  cipher: CryptoKey | null;
  hasSignedIn: boolean;
  hasSignedUp: boolean;
  passphrase: string;
  resetWallet: () => void;
  setPassphrase: (value: string) => void;
  setVerifier: (value: string) => void;
  signIn: (e: string, p: string) => void;
  signOut: () => void;
  signUp: (e: string, p: string) => void;
  verifier: string;
  verify: (key: CryptoKey | null) => Promise<boolean>;
}>({
  challenge: "",
  cipher: null,
  hasSignedIn: false,
  hasSignedUp: false,
  passphrase: "",
  resetWallet: () => {},
  setPassphrase: () => {},
  setVerifier: () => {},
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  verifier: "",
  verify: async () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}
