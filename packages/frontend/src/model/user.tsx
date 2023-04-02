import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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


export const useWrappedFetch = () => {
  const { token, setCurrentToken } = useContext(LoginContext);

  const wrapped = useMemo(() => {
    return async (resource: any, init: any) => {
      const headers = init?.headers ? init.headers : {};
      const authHeader = token ? {
        Authorization: `Bearer ${token.access_token}`
      } : {};
      const resp = await fetch(resource, {
        ...init,
        headers: {
          ...headers,
          ...authHeader
        }
      });

      if (!resp.ok && resp.status == 401) {
        setCurrentToken(null);
      }

      return resp;
    };
  }, [token]);

  return wrapped;
};
