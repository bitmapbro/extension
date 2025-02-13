import background from "@/entrypoints/background";
import { useState } from "react";

const defaultState = {
  show: false,
  text: "",
};

export let alert: (text: string, level?: string) => void = () => {};

export default function () {
  const [state, setState] = useState(defaultState);
  const [backgroundColor, setBackgroundColor] = useState("rgb(36, 36, 36)");
  alert = (text: string, level?: string) => {
    setState({ text, show: true });
    setTimeout(() => setState(defaultState), 3000);

    setBackgroundColor(
      (() => {
        if (level === "error") return "rgb(69, 39, 39)";
        return "rgb(36, 36, 36)";
      })()
    );
  };

  return (
    <div
      style={{
        backgroundColor,
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0",
        left: "0",
        fontSize: "1.5rem",

        display: state.show ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        opacity: state.show ? 1 : 0,
        transition: "opacity 2s",
      }}
    >
      {state?.text}
    </div>
  );
}
