import { useAccount } from 'wagmi';

export default function Header({ onOpenWallet }) {
  const { address, isConnected } = useAccount();

  const shortAddr = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : '';

  return (
    <header className="flex justify-between items-center py-4 px-5 max-w-md mx-auto w-full">
      <span className="text-[1.28rem] font-extrabold tracking-tight text-white flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="#FF007A" />
          <text x="14" y="19" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">S</text>
        </svg>
        SushiMobile
      </span>
      {isConnected ? (
        <button
          className="py-2 px-5 rounded-xl font-semibold text-sm bg-black/20 border border-neon text-neon transition hover:bg-neon/10"
          onClick={onOpenWallet}
          aria-label="Wallet"
        >
          {shortAddr}
        </button>
      ) : (
        <button
          className="py-2 px-5 rounded-xl font-semibold text-sm bg-neon text-white transition hover:bg-pink-700"
          onClick={onOpenWallet}
          aria-label="Connect Wallet"
        >
          Connect
        </button>
      )}
    </header>
  );
}
