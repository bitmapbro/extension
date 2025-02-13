import { createContext } from "react";

export default function TestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = createContext({});
  return <c.Provider value={{}}>{children}</c.Provider>;
}
