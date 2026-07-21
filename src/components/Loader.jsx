import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      className="flex items-center justify-center w-12 h-12"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
    >
      <svg width={32} height={32} fill="none" aria-hidden="true">
        <circle cx={16} cy={16} r={14} stroke="#FF007A" strokeWidth={4} strokeDasharray="20 44" />
      </svg>
    </motion.div>
  );
}