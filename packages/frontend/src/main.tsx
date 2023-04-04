import React, { useContext, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { BareFetcher, SWRConfig } from 'swr'
import App from './App'
import './index.css'
import { LoginContext, LoginProvider } from './model/user'

const WrapFetcher = () => {
  const { token } = useContext(LoginContext);

  const swrConfig = useMemo(() => {
    const fetcher: BareFetcher<any> = async (resource, init) => {
      const headers = init?.headers ? init.headers : {};
      const resp = fetch(resource, {
        ...init,
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`
        }
      });
      return (await resp).json()
    };
    return { fetcher };
  }, [token]);


  return (
    <SWRConfig value={swrConfig}>
      <App />
    </SWRConfig>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LoginProvider>
      <WrapFetcher />
    </LoginProvider>
  </React.StrictMode>,
)
