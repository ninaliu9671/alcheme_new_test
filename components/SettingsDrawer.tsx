"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import type { Card } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
};

function downloadBlob(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function todayStamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function SettingsDrawer({ open, onClose }: Props) {
  const entries = useStore((s) => s.entries);
  const addEntry = useStore((s) => s.addEntry);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const payload = {
      app: "alcheme",
      version: 1,
      exportedAt: new Date().toISOString(),
      entries,
    };
    downloadBlob(
      `alcheme-backup-${todayStamp()}.json`,
      JSON.stringify(payload, null, 2)
    );
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so same file can be re-picked
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const incoming: Card[] = Array.isArray(data) ? data : data.entries;
      if (!Array.isArray(incoming)) throw new Error("不是合法的卡片备份文件");
      const existingIds = new Set(entries.map((c) => c.id));
      let added = 0;
      for (const c of incoming) {
        if (
          c &&
          typeof c.id === "string" &&
          Array.isArray(c.sentences) &&
          typeof c.rawText === "string" &&
          typeof c.createdAt === "number" &&
          !existingIds.has(c.id)
        ) {
          addEntry(c);
          added += 1;
        }
      }
      alert(`已导入 ${added} 张新卡片。`);
    } catch (err) {
      console.error(err);
      alert("导入失败：" + (err as Error).message);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="关闭设置"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sheet */}
          <motion.div
            className="relative w-full max-w-[420px] bg-paper paper-lines rounded-t-3xl border-[1.5px] border-ink border-b-0 px-5 pt-3 pb-8 shadow-[0_-3px_0_0_#0F0F0F]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pb-2">
              <span className="block w-10 h-1 rounded-full bg-ink/30" aria-hidden />
            </div>

            <div className="relative">
              <div className="dashed-inset" aria-hidden />
              <div className="relative">
                <h2 className="text-center text-[15px] font-bold text-ink mb-4">
                  ⚙ 设置
                </h2>

                <Section title="数据">
                  <Row
                    icon={<DownloadIcon />}
                    title="导出全部卡片"
                    subtitle={`备份当前 ${entries.length} 张卡片为 JSON 文件`}
                    onClick={handleExport}
                    disabled={entries.length === 0}
                  />
                  <Row
                    icon={<UploadIcon />}
                    title="导入卡片"
                    subtitle="从之前导出的 JSON 恢复"
                    onClick={handleImportClick}
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={handleImportFile}
                  />
                </Section>

                <Section title="账号" subtitle="即将推出">
                  <Row
                    icon={<UserIcon />}
                    title="登录 / Profile"
                    subtitle="跨设备同步你的魔法盒"
                    onClick={() => {}}
                    disabled
                  />
                </Section>

                <div className="mt-4 text-center text-[10px] text-ink/40">
                  Alcheme · v0.1
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between px-1 mb-1.5">
        <span className="text-[11px] font-medium text-ink/70 uppercase tracking-wide">
          {title}
        </span>
        {subtitle && <span className="text-[10px] text-ink/40">{subtitle}</span>}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-ink/15 bg-paper/60 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform text-left"
    >
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-ink text-paper flex-shrink-0">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-medium text-ink">{title}</span>
        {subtitle && (
          <span className="block text-[11px] text-ink/55 mt-0.5 truncate">{subtitle}</span>
        )}
      </span>
      <ChevronIcon />
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v13" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 17V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/30 flex-shrink-0" aria-hidden>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
