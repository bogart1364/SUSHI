export default function GlassContainer({ children, className = '', role = 'region', ariaLabel }) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={`rounded-2xl bg-glass border border-border backdrop-blur-md shadow-lg p-4 animate-fade-in ${className}`}
      style={{
        boxShadow: '0 8px 40px rgba(0,0,0,0.38)',
        border: '1.2px solid rgba(255,255,255,0.08)'
      }}
    >
      {children}
    </div>
  );
}
