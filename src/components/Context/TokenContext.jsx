import { useState } from "react";
import { TokenContext } from "./contexts";

export default function TokenContextProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("userToken")
  );

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
}
