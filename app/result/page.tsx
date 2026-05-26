"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PhoneFrame from "@/components/PhoneFrame";
import TopBar from "@/components/TopBar";
import PaperCard from "@/components/PaperCard";
import PillButton from "@/components/PillButton";
import EssenceEditor from "@/components/EssenceEditor";
import { useStore } from "@/lib/store";
import type { Card } from "@/lib/types";

export default function ResultPage() {
  const router = useRouter();
  const sentences = useStore((s) => s.currentExtract);
  const draft = useStore((s) => s.currentDraft);
  const addEntry = useStore((s) => s.addEntry);
  const reset = useStore((s) => s.reset);
  const [flying, setFlying] = useState(false);
  const [editedSentences, setEditedSentences] = useState<string[]>(sentences);

  // Sync if extraction finishes after this page mounts (e.g., navigation race).
  useEffect(() => {
    setEditedSentences(sentences);
  }, [sentences]);

  function handleSave() {
    if (flying) return;
    setFlying(true);
  }

  function onFlyComplete() {
    const cleaned = editedSentences.map((s) => s.trim()).filter((s) => s.length > 0);
    const card: Card = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sentences: cleaned,
      rawText: draft,
      createdAt: Date.now(),
    };
    addEntry(card);
    reset();
    router.push("/box");
  }

  function handleRewrite() {
    reset();
    router.push("/");
  }

  const canSave = editedSentences.some((s) => s.trim().length > 0) && !flying;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <PhoneFrame>
        <TopBar variant="sub" onBack={handleRewrite} />

        <div className="relative flex justify-center mt-1">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Image
              src="/assets/witch-cauldron.png"
              alt="witch with cauldron"
              width={220}
              height={220}
              className="w-48 h-auto"
              priority
            />
            <div className="pointer-events-none absolute inset-0">
              {[0, 0.7, 1.4].map((delay, i) => (
                <motion.span
                  key={i}
                  className="absolute block rounded-full bg-white/70"
                  style={{
                    width: 14,
                    height: 10,
                    left: `${48 + i * 6}%`,
                    top: "62%",
                  }}
                  initial={{ y: 0, opacity: 0.8, scale: 0.8 }}
                  animate={{ y: -40, opacity: 0, scale: 1.3 }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay,
                    ease: "easeOut",
                  }}
                  aria-hidden
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={
            flying
              ? { scale: 0.2, y: -300, x: 0, opacity: 0 }
              : { scale: 1, y: 0, x: 0, opacity: 1 }
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (flying) onFlyComplete();
          }}
        >
          <PaperCard className="mt-2">
            <h2 className="text-center font-bold text-[16px] mb-1">
              ✨ 你的魔法精华
            </h2>
            <p className="text-center text-[11px] text-ink/50 mb-3">
              可以直接修改，再存入魔法盒
            </p>
            {editedSentences.length === 0 ? (
              <p className="text-ink/50 text-sm py-4 text-center">还没有提炼内容。</p>
            ) : (
              <EssenceEditor
                value={editedSentences}
                onChange={setEditedSentences}
              />
            )}
          </PaperCard>
        </motion.div>

        <div className="flex justify-center gap-3 mt-3">
          <PillButton onClick={handleSave} showStars={false} className="px-5" disabled={!canSave}>
            <span className="mr-1">📦</span>
            <span>存入魔法盒</span>
          </PillButton>
          <PillButton
            onClick={handleRewrite}
            variant="secondary"
            showStars={false}
            className="px-5"
            disabled={flying}
          >
            <span className="mr-1">↻</span>
            <span>再写一篇</span>
          </PillButton>
        </div>
      </PhoneFrame>
    </motion.div>
  );
}
