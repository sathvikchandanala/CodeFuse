import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export default function Alert({ message, type = "success", onClose }) {
  const colors = {
    error: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-400 text-black",
  };

  const icons = {
    error: <AiOutlineCloseCircle className="w-6 h-6" />,
    success: <AiOutlineCheckCircle className="w-6 h-6" />,
    info: null,
    warning: null,
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${colors[type]}`}
          role="alert"
        >
          {icons[type]}
          <span className="flex-1 font-semibold">{message}</span>
          <button
            onClick={onClose}
            className="font-bold hover:opacity-80 transition-opacity"
            aria-label="Close alert"
          >
            &times;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
