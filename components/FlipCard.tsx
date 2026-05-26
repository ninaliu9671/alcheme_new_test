"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import StarBullet from "./StarBullet";
import EssenceEditor from "./EssenceEditor";
import type { Card } from "@/lib/types";

type Props = {
  card: Card;
  className?: string;
  style?: React.CSSProperties;
  onDelete?: (id: string) => void;
  onSave?: (id: string, patch: { sentences: string[]; rawText: string }) => void;
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 15.5-6.3M21 5v4h-4" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3M3 19v-4h4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20h4l11-11-4-4L4 16v4z" />
      <path d="M14 6l4 4" />
    </svg>
  );
}

export default function FlipCard({ card, className = "", style, onDelete, onSave }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftSentences, setDraftSentences] = useState<string[]>(card.sentences);
  const [draftRawText, setDraftRawText] = useState<string>(card.rawText);

  // Keep drafts in sync when the underlying card changes (e.g., after save).
  useEffect(() => {
    if (!editing) {
      setDraftSentences(card.sentences);
      setDraftRawText(card.rawText);
    }
  }, [card.sentences, card.rawText, editing]);

  function enterEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setDraftSentences(card.sentences);
    setDraftRawText(card.rawText);
    setEditing(true);
  }
  function cancelEdit(e?: React.MouseEvent) {
    e?.stopPropagation();
    setEditing(false);
  }
  function saveEdit(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!onSave) return;
    const cleaned = draftSentences.map((s) => s.trim()).filter((s) => s.length > 0);
    onSave(card.id, { sentences: cleaned, rawText: draftRawText });
    setEditing(false);
  }

  return (
    <motion.div
      className={`relative w-full ${className}`}
      style={{ perspective: "1200px", ...style }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={flipped ? "翻回精华" : "翻面看原文"}
        onClick={() => !editing && setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (editing) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className={`block w-full text-left outline-none ${editing ? "" : "cursor-pointer"}`}
        whileHover={editing ? undefined : { y: -2 }}
        whileTap={editing ? undefined : { scale: 0.99 }}
      >
        <motion.div
          className="relative w-full preserve-3d"
          animate={{
            rotateY: flipped ? 180 : 0,
            scale: editing ? 1 : [1, 1.02, 1],
          }}
          transition={{
            rotateY: { type: "spring", stiffness: 120, damping: 14, duration: 0.6 },
            scale: { duration: 0.6, times: [0, 0.5, 1] },
          }}
        >
          {/* Front — essence */}
          <div
            className="relative backface-hidden bg-paper paper-lines rounded-2xl border-[1.5px] border-ink p-4"
            onClick={(e) => editing && e.stopPropagation()}
          >
            <div className="dashed-inset" aria-hidden />
            <div className="relative">
              {editing ? (
                <EssenceEditor value={draftSentences} onChange={setDraftSentences} />
              ) : (
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
              )}

              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-[11px] text-ink/60 flex-shrink-0">
                  {formatTime(card.createdAt)}
                </span>
                {editing ? (
                  <EditActions onCancel={cancelEdit} onSave={saveEdit} />
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-ink/55 flex-shrink-0">
                    <FlipIcon />
                    翻面看原文
                  </span>
                )}
              </div>
            </div>

            {/* Top-right action icons (view mode only) */}
            {!editing && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5">
                {onSave && (
                  <button
                    type="button"
                    aria-label="编辑这张卡片"
                    onClick={enterEdit}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-ink/40 hover:text-ink hover:bg-ink/5 active:bg-ink/10 transition-colors"
                  >
                    <PencilIcon />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    aria-label="删除这张卡片"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(card.id);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-ink/40 hover:text-ink hover:bg-ink/5 active:bg-ink/10 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Back — raw text */}
          <div
            className="absolute inset-0 backface-hidden bg-card-back text-paper rounded-2xl border-[1.5px] border-ink p-4 flex flex-col"
            style={{ transform: "rotateY(180deg)" }}
            onClick={(e) => editing && e.stopPropagation()}
          >
            {editing ? (
              <textarea
                value={draftRawText}
                onChange={(e) => setDraftRawText(e.target.value)}
                className="font-hand text-[18px] leading-[26px] flex-1 min-h-[140px] bg-transparent text-paper placeholder:text-paper/40 outline-none border-none resize-none w-full"
                placeholder="原文..."
              />
            ) : (
              <div className="font-hand text-[18px] leading-[26px] whitespace-pre-wrap pr-1 flex-1 min-h-0 overflow-y-auto overscroll-contain">
                {card.rawText || "(空)"}
              </div>
            )}
            <div className="mt-3 flex items-end justify-between gap-3 flex-shrink-0">
              <span className="text-[11px] text-paper/60 font-sans flex-shrink-0">
                {formatTime(card.createdAt)}
              </span>
              {editing ? (
                <EditActions onCancel={cancelEdit} onSave={saveEdit} dark />
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-paper/60 font-sans flex-shrink-0">
                  <FlipIcon />
                  翻回精华
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function EditActions({
  onCancel,
  onSave,
  dark = false,
}: {
  onCancel: (e?: React.MouseEvent) => void;
  onSave: (e?: React.MouseEvent) => void;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={onCancel}
        className={`h-7 px-3 rounded-full border text-[11px] font-medium active:scale-95 transition-transform ${
          dark
            ? "border-paper/40 text-paper bg-transparent"
            : "border-ink/40 text-ink bg-transparent"
        }`}
      >
        取消
      </button>
      <button
        type="button"
        onClick={onSave}
        className={`h-7 px-3 rounded-full border text-[11px] font-medium active:scale-95 transition-transform ${
          dark
            ? "border-paper bg-paper text-ink"
            : "border-ink bg-ink text-paper"
        }`}
      >
        保存
      </button>
    </div>
  );
}
