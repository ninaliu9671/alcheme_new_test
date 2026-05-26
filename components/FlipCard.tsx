"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StarBullet from "./StarBullet";
import type { Card } from "@/lib/types";

type Props = {
  card: Card;
  className?: string;
  style?: React.CSSProperties;
};

function formatTime(ts: number) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

function FlipIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.3M21 5v4h-4" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3M3 19v-4h4" />
    </svg>
  );
}

export default function FlipCard({ card, className = "", style }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className={`relative w-full ${className}`}
      style={{ perspective: "1200px", ...style }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="block w-full text-left"
        aria-label={flipped ? "翻回精华" : "翻面看原文"}
      >
        <motion.div
          className="relative w-full preserve-3d"
          animate={{
            rotateY: flipped ? 180 : 0,
            scale: [1, 1.02, 1],
          }}
          transition={{
            rotateY: { type: "spring", stiffness: 120, damping: 14, duration: 0.6 },
            scale: { duration: 0.6, times: [0, 0.5, 1] },
          }}
          style={{ minHeight: 220 }}
        >
          {/* Front — essence */}
          <div className="absolute inset-0 backface-hidden bg-paper paper-lines rounded-2xl border-[1.5px] border-ink p-4">
            <div className="dashed-inset" aria-hidden />
            <div className="relative">
              <ul className="space-y-2">
                {card.sentences.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 leading-[24px] text-[14px]">
                    <span className="pt-1 flex-shrink-0">
                      <StarBullet size={14} />
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-[11px] text-ink/60">{formatTime(card.createdAt)}</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-ink/55">
                  <FlipIcon />
                  翻面看原文
                </span>
              </div>
            </div>
          </div>

          {/* Back — raw text */}
          <div
            className="absolute inset-0 backface-hidden bg-card-back text-paper rounded-2xl border-[1.5px] border-ink p-4"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="font-hand text-[18px] leading-[26px] whitespace-pre-wrap pr-1 max-h-[160px] overflow-auto">
              {card.rawText || "(空)"}
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-[11px] text-paper/60 font-sans">
                {formatTime(card.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-paper/60 font-sans">
                <FlipIcon />
                翻回精华
              </span>
            </div>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}
