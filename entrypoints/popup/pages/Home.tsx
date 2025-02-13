import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function () {
  const redirect = useNavigate();
  const { hasSignedUp, hasSignedIn, passphrase } = useAuth();
  useEffect(() => {
    (async () => {
      if (!hasSignedUp) {
        redirect("/signup");
        return;
      }
      if (!(await hasSignedIn)) {
        redirect("/signin");
        return;
      }
      if (!passphrase) {
        redirect("/phrase");
        return;
      }
      redirect("/account/tokens");
    })();
  }, []);

  return <></>;
}
