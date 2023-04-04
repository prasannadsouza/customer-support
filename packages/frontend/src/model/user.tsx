import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Token } from "shared";

export type AuthState = {
  token: Token | null
  setCurrentToken: (s: Token | null) => void
}

const storageKey = "logintoken";

export const LoginContext = createContext<AuthState>({ token: null, setCurrentToken: (_: Token | null) => {} });

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<Token | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem(storageKey);
    const value = user ? JSON.parse(user) : null;
    setToken(value);
    setReady(true);
  }, []);

  const setCurrentToken = useCallback((val: Token | null) => {
    setToken(val);
    if (val) {
      localStorage.setItem(storageKey, JSON.stringify(val));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, []);

  const contextValue = useMemo<AuthState>(() => ({
    token,
    setCurrentToken,
  }), [token, setCurrentToken]);

  return (
    <LoginContext.Provider value={contextValue}>
      {ready ? children : null}
    </LoginContext.Provider>
  );
};
