import { motion } from 'framer-motion';

export default function GlassContainer({ children, className = '', role = 'region', ariaLabel }) {
  return (
    <motion.div
      role={role}
      aria-label={ariaLabel}
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 19 }}
      className={`rounded-2xl bg-glass border border-border backdrop-blur-md shadow-lg p-4 ${className}`}
      style={{
        boxShadow: '0 8px 40px rgba(0,0,0,0.38)',
        border: '1.2px solid rgba(255,255,255,0.08)'
      }}
    >
      {children}
    </motion.div>
  );
}