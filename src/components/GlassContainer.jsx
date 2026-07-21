export default function GlassContainer({ children, className = '', role = 'region', ariaLabel }) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={`glass-sushi rounded-3xl p-4 animate-fade-in shadow-card ${className}`}
    >
      {children}
    </div>
  );
}
