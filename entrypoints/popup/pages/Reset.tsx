import { useEffect } from "react";
import { redirect } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function () {
  const { resetWallet } = useAuth();
  useEffect(() => {
    (async () => {
      await resetWallet();
      redirect("/signup");
    })();
  }, []);
  return <div />;
}
