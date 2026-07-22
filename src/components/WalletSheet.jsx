import { useState } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';

const WALLET_DATA = {
  'injected': {
    name: 'MetaMask',
    desc: 'Connect with MetaMask',
    img: 'https://docs.metamask.io/img/metamask-fox.svg',
    bg: '#F6851B',
  },
  'walletConnect': {
    name: 'WalletConnect',
    desc: 'Scan QR with any wallet',
    img: 'https://raw.githubusercontent.com/nickmetsch/walletconnect-logo/main/walletconnect-circle-blue.svg',
    bg: '#3B99FC',
  },
  'coinbaseWalletSDK': {
    name: 'Coinbase Wallet',
    desc: 'Connect with Coinbase',
    img: 'https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-logo.png',
    bg: '#0052FF',
  },
};

export default function WalletSheet({ open, onClose }) {
  const { connectors, connect, isPending } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [connectingId, setConnectingId] = useState(null);
  const [connectError, setConnectError] = useState('');

  if (!open) return null;

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  const handleConnect = async (connector) => {
    setConnectingId(connector.id);
    setConnectError('');
    try {
      await connect({ connector });
      onClose();
    } catch (e) {
      setConnectError(e.message || 'Connection failed');
    } finally {
      setConnectingId(null);
    }
  };

  if (isConnected) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3" />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-neon/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-success rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Connected</p>
                <p className="text-gray-500 text-xs">{shortAddr}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm active:scale-[0.98]" onClick={() => { navigator.clipboard.writeText(address); onClose(); }}>
                Copy Address
              </button>
              <button className="w-full py-3 rounded-xl bg-error/10 border border-error/20 text-error font-semibold text-sm active:scale-[0.98]" onClick={() => { disconnect(); onClose(); }}>
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#141420] rounded-3xl border border-white/10 w-[85%] max-w-xs z-10">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3" />
        <div className="p-5">
          <h2 className="text-lg font-bold text-white text-center mb-4">Connect Wallet</h2>
          <div className="space-y-2">
            {connectors.map((connector) => {
              const data = WALLET_DATA[connector.id] || { name: connector.name || 'Wallet', desc: 'Connect', bg: '#333', img: null };
              const isLoading = connectingId === connector.id;

              return (
                <button
                  key={connector.id}
                  disabled={isPending || isLoading}
                  className="flex w-full items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition active:scale-[0.98] disabled:opacity-50"
                  onClick={() => handleConnect(connector)}
                >
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: data.bg || '#333' }}>
                    <img
                      src={data.img}
                      alt={data.name}
                      className="w-7 h-7 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<span style="color:white;font-weight:bold;font-size:18px">${data.name[0]}</span>`;
                      }}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-white font-semibold text-sm">{data.name}</p>
                    <p className="text-gray-500 text-[11px]">{data.desc}</p>
                  </div>
                  {isLoading && <div className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin" />}
                </button>
              );
            })}
          </div>
          {connectError && (
            <div className="mt-3 p-2 rounded-lg bg-error/10 border border-error/20">
              <p className="text-error text-xs text-center">{connectError}</p>
            </div>
          )}
          <p className="text-center text-gray-600 text-[11px] mt-3">
            No wallet? <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-neon">Get one</a>
          </p>
        </div>
      </div>
    </div>
  );
}
