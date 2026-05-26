"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "确定要做这件事吗？",
  message,
  confirmLabel = "确定",
  cancelLabel = "取消",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="cancel"
            className="absolute inset-0 bg-ink/40"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-[320px] bg-paper paper-lines rounded-2xl border-[1.5px] border-ink p-5 shadow-[0_3px_0_0_#0F0F0F]"
            initial={{ scale: 0.9, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="dashed-inset" aria-hidden />
            <div className="relative">
              <div className="text-center text-[15px] font-bold text-ink leading-[24px]">
                {title}
              </div>
              {message && (
                <div className="mt-2 text-center text-[13px] text-ink/70 leading-[20px]">
                  {message}
                </div>
              )}
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 h-10 rounded-full border-[1.5px] border-ink bg-paper text-ink text-[14px] font-medium active:scale-95 transition-transform"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 h-10 rounded-full border-[1.5px] border-ink bg-ink text-paper text-[14px] font-medium active:scale-95 transition-transform"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
