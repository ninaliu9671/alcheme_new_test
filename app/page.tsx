"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import PhoneFrame from "@/components/PhoneFrame";
import TopBar from "@/components/TopBar";
import BottomTabs from "@/components/BottomTabs";
import PaperCard from "@/components/PaperCard";
import PillButton from "@/components/PillButton";
import { useStore } from "@/lib/store";
import { extractEssence } from "@/lib/ai";

const MAX = 1000;

export default function InputPage() {
  const router = useRouter();
  const setDraft = useStore((s) => s.setDraft);
  const setExtract = useStore((s) => s.setExtract);
  const initialDraft = useStore((s) => s.currentDraft);
  const [text, setText] = useState(initialDraft || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) return;
    setLoading(true);
    const value = text.trim();
    setDraft(value);
    try {
      const sentences = await extractEssence(value || "今天没什么特别的事。");
      setExtract(sentences);
      router.push("/result");
    } finally {
      setLoading(false);
    }
  }

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
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/assets/witch-broom.png"
              alt="witch on broom"
              width={220}
              height={220}
              className="w-48 h-auto"
              priority
            />
          </motion.div>
        </div>

        <PaperCard className="mt-2">
          <div className="relative min-h-[260px]">
            <textarea
              className="paper-textarea text-[15px] text-ink placeholder:text-ink/40"
              placeholder={"今天我做到了…我允许自己了…\n记录今日闪光碎片，夸夸我真棒！\n或者，只是来说说过得怎么样…\n好与不好，我们一起稳稳地接住自己。"}
              value={text}
              maxLength={MAX}
              onChange={(e) => setText(e.target.value)}
              rows={8}
            />
            <div className="absolute bottom-0 right-0 text-[11px] text-ink/50">
              {text.length}/{MAX}
            </div>
          </div>
        </PaperCard>

        <div className="flex justify-center mt-3">
          <PillButton onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <motion.span
                className="inline-flex items-center gap-2"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.span
                  className="text-gold inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  aria-hidden
                >
                  ★
                </motion.span>
                煮制中...
              </motion.span>
            ) : (
              "提炼我的魔法"
            )}
          </PillButton>
        </div>
      </PhoneFrame>
      <BottomTabs />
    </motion.div>
  );
}
