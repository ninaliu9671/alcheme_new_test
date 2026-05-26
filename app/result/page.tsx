"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import PhoneFrame from "@/components/PhoneFrame";
import TopBar from "@/components/TopBar";
import PaperCard from "@/components/PaperCard";
import PillButton from "@/components/PillButton";
import StarBullet from "@/components/StarBullet";
import { useStore } from "@/lib/store";
import type { Card } from "@/lib/types";

export default function ResultPage() {
  const router = useRouter();
  const sentences = useStore((s) => s.currentExtract);
  const draft = useStore((s) => s.currentDraft);
  const addEntry = useStore((s) => s.addEntry);
  const reset = useStore((s) => s.reset);
  const [flying, setFlying] = useState(false);

  function handleSave() {
    if (flying) return;
    setFlying(true);
  }

  function onFlyComplete() {
    const card: Card = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sentences,
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
            {/* Steam puffs over cauldron */}
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
            <h2 className="text-center font-bold text-[16px] mb-3">
              ✨ 你的魔法精华
            </h2>
            <ul className="space-y-3 leading-[28px]">
              {sentences.length === 0 ? (
                <li className="text-ink/50 text-sm">还没有提炼内容。</li>
              ) : (
                sentences.map((s, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2 text-[15px]"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.35 }}
                  >
                    <span className="pt-1 flex-shrink-0">
                      <StarBullet size={16} />
                    </span>
                    <span>{s}</span>
                  </motion.li>
                ))
              )}
            </ul>
          </PaperCard>
        </motion.div>

        <div className="flex justify-center gap-3 mt-3">
          <PillButton onClick={handleSave} showStars={false} className="px-5" disabled={flying}>
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
