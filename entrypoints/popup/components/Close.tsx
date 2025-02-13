import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, type To, type NavigateOptions } from "react-router-dom";
import { ReactNode } from "react";

export default function ({
  redirectTo,
  opts,
}: {
  redirectTo: To;
  opts?: NavigateOptions;
}): ReactNode {
  const redirect = useNavigate();
  return (
    <IconButton
      onClick={() => redirect(redirectTo, opts)}
      sx={{ position: "fixed", top: 0, right: 0, zIndex: 2000 }}
    >
      <CloseIcon />
    </IconButton>
  );
}
