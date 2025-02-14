import { useLocation, useNavigate, Navigate, Outlet } from "react-router";
import { useState, useEffect, useContext, createContext } from "react";
import { decrypt, derive, encrypt } from "./derive";
import { store } from "./store";
import { storage } from "wxt/storage";

export function PrivateRoutes(): React.ReactNode {
  const { hasSignedIn, hasSignedUp, passphrase } = useAuth();
  if (!hasSignedUp && location.pathname !== "/signup") {
    return <Navigate to="/signup" />;
  }
  if (!hasSignedIn && location.pathname !== "/signin") {
    return <Navigate to="/signin" />;
  }
  if (passphrase && location.pathname.startsWith("/phrase")) {
    return <Navigate to="/phrase" />;
  }
  return <Outlet />;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps): React.ReactNode {
  const redirect = useNavigate();
  const [challenge, setChallenge] = useState("");
  const [cipher, setCipher] = useState(null as CryptoKey | null);
  const [verifier, setVerifier] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  const signIn = async (email: string, password: string) => {
    const { encrypter } = await derive(email, password);
    if (!encrypter) {
      setCipher(null);
      return false;
    }
    let output = "";
    try {
      output = await decrypt(encrypter, verifier);
    } catch {
      setCipher(null);
      return false;
    }
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
    const { encrypter } = await derive(email, password);
    const output = await encrypt(encrypter, challenge);
    await storage.setItem(`local:${store.verifier}`, output);
    setVerifier(output);
    setHasSignedUp(true);
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
      const challenge = await storage.getItem<string>(
        `local:${store.challenge}`
      );
      const verifier = await storage.getItem<string>(`local:${store.verifier}`);
      setChallenge(challenge ?? "");
      setVerifier(verifier ?? "");
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
      setPassphrase("");
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
      return;
    }
    if (verifier && cipher) {
      setHasSignedIn(true);
      return;
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
        savePassphrase,
        signIn,
        signOut,
        signUp,
        verifier,
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
  savePassphrase: (value: string) => void;
  signIn: (e: string, p: string) => void;
  signOut: () => void;
  signUp: (e: string, p: string) => void;
  verifier: string;
}>({
  challenge: "",
  cipher: null,
  hasSignedIn: false,
  hasSignedUp: false,
  passphrase: "",
  resetWallet: () => {},
  savePassphrase: () => {},
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  verifier: "",
});

export function useAuth() {
  return useContext(AuthContext);
}
