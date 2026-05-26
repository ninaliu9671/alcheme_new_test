"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PhoneFrame from "@/components/PhoneFrame";
import TopBar from "@/components/TopBar";
import BottomTabs from "@/components/BottomTabs";
import FlipCard from "@/components/FlipCard";
import { useStore } from "@/lib/store";

export default function BoxPage() {
  const entries = useStore((s) => s.entries);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Newest first
  const cards = mounted ? [...entries].sort((a, b) => b.createdAt - a.createdAt) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <PhoneFrame withTabs>
        <TopBar variant="tab" />

        <div className="flex justify-center mt-1">
          <Image
            src="/assets/treasure-box.png"
            alt="treasure box"
            width={260}
            height={220}
            className="w-52 h-auto"
            priority
          />
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <h2 className="font-bold text-[16px]">✨ 我的魔法盒</h2>
          <span className="text-[12px] text-ink/70">
            {cards.length} 张卡片
          </span>
        </div>

        {/* Scrollable card list */}
        <div className="mt-3 flex flex-col gap-4">
          {cards.length === 0 ? (
            <div className="relative bg-paper paper-lines rounded-2xl border-[1.5px] border-ink p-6 text-center text-ink/60 text-sm">
              <div className="dashed-inset" aria-hidden />
              <div className="relative">
                还没有卡片，去「炼制」写一篇吧 ✨
              </div>
            </div>
          ) : (
            cards.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <FlipCard card={c} />
              </motion.div>
            ))
          )}
        </div>
      </PhoneFrame>
      <BottomTabs />
    </motion.div>
  );
}
