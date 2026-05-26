"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import StarBullet from "./StarBullet";
import type { Card } from "@/lib/types";

type Props = {
  card: Card;
  className?: string;
  style?: React.CSSProperties;
  onDelete?: (id: string) => void;
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

function FlipIcon() {
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
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.3M21 5v4h-4" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3M3 19v-4h4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export default function FlipCard({ card, className = "", style, onDelete }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className={`relative w-full ${className}`}
      style={{ perspective: "1200px", ...style }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={flipped ? "翻回精华" : "翻面看原文"}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className="block w-full text-left cursor-pointer outline-none"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
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
        >
          {/* Front — essence */}
          <div className="relative backface-hidden bg-paper paper-lines rounded-2xl border-[1.5px] border-ink p-4">
            <div className="dashed-inset" aria-hidden />
            <div className="relative">
              <ul className="space-y-2 pr-7">
                {card.sentences.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 leading-[24px] text-[14px]">
                    <span className="pt-1 flex-shrink-0">
                      <StarBullet size={14} />
                    </span>
                    <span className="break-words">{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-[11px] text-ink/60 flex-shrink-0">
                  {formatTime(card.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-ink/55 flex-shrink-0">
                  <FlipIcon />
                  翻面看原文
                </span>
              </div>
            </div>

            {/* Delete button — top-right */}
            {onDelete && (
              <button
                type="button"
                aria-label="删除这张卡片"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card.id);
                }}
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-ink/40 hover:text-ink hover:bg-ink/5 active:bg-ink/10 transition-colors"
              >
                <TrashIcon />
              </button>
            )}
          </div>

          {/* Back — raw text */}
          <div
            className="absolute inset-0 backface-hidden bg-card-back text-paper rounded-2xl border-[1.5px] border-ink p-4 flex flex-col"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="font-hand text-[18px] leading-[26px] whitespace-pre-wrap pr-1 flex-1 min-h-0 overflow-y-auto overscroll-contain">
              {card.rawText || "(空)"}
            </div>
            <div className="mt-3 flex items-end justify-between gap-3 flex-shrink-0">
              <span className="text-[11px] text-paper/60 font-sans flex-shrink-0">
                {formatTime(card.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-paper/60 font-sans flex-shrink-0">
                <FlipIcon />
                翻回精华
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
