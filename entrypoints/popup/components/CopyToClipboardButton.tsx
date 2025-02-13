import { SxProps, Theme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { alert } from "./Alert";

const handleClick = (text: string) => {
  return () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };
};

export default function ({ sx, text }: { sx: SxProps<Theme>; text: string }) {
  return (
    <ContentCopyIcon
      onClick={handleClick(text)}
      sx={{
        "&:hover": {
          cursor: "pointer",
          color: "primary.main",
        },
        ...sx,
      }}
    ></ContentCopyIcon>
  );
}
