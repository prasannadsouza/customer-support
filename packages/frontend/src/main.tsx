import React, { useContext, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { BareFetcher, SWRConfig } from 'swr'
import App from './App'
import './index.css'
import { LoginProvider, useWrappedFetch } from './model/user'

const WrapFetcher = () => {
  const wrappedFetcher = useWrappedFetch();

  const swrConfig = useMemo(() => {
    const fetcher: BareFetcher<any> = async (resource, init) => {
      const resp = await wrappedFetcher(resource, init);
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json()
    };
    return { fetcher };
  }, [wrappedFetcher]);


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
