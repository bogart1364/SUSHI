import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import App from './App';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || '';

export const AppContext = createContext({ hasPrivy: false });

export function useAppContext() {
  return useContext(AppContext);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0f', color: '#fff', padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Something went wrong</p>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 24px', background: '#FF007A', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 'bold', cursor: 'pointer' }}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PrivyProviders({ children }) {
  const [PrivyProvider, setPrivyProvider] = useState(null);
  const [privyConfig, setPrivyConfig] = useState(null);
  const [PrivyWagmiProvider, setPrivyWagmiProvider] = useState(null);

  useEffect(() => {
    Promise.all([
      import('@privy-io/react-auth'),
      import('./config/privy'),
      import('@privy-io/wagmi'),
    ]).then(([authMod, configMod, wagmiMod]) => {
      setPrivyProvider(() => authMod.PrivyProvider);
      setPrivyConfig(configMod.privyConfig);
      setPrivyWagmiProvider(() => wagmiMod.WagmiProvider);
    }).catch(() => {});
  }, []);

  if (!PrivyProvider || !privyConfig || !PrivyWagmiProvider) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    );
  }

  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <PrivyWagmiProvider config={config}>
          {children}
        </PrivyWagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppContext.Provider value={{ hasPrivy: !!PRIVY_APP_ID }}>
        <PrivyProviders>
          <App />
        </PrivyProviders>
      </AppContext.Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
