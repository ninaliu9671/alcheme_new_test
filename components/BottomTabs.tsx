"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

type TabKey = "/" | "/box";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "/",
    label: "炼制",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* feather quill */}
        <path d="M4 20 L13 11" />
        <path d="M14 4c4 1 5 7 1 11l-4 1-1 1H7l-2 2v-3l1-2 1-1 1-4c4-4 10-3 11-2" />
        <path d="M9 15 L11 17" />
      </svg>
    ),
  },
  {
    key: "/box",
    label: "魔法盒",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* chest */}
        <rect x="3" y="9" width="18" height="12" rx="1.5" />
        <path d="M3 9c0-3 4-5 9-5s9 2 9 5" />
        <path d="M3 13h18" />
        <rect x="10.5" y="11.5" width="3" height="3" rx="0.5" />
      </svg>
    ),
  },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-[420px] mx-auto px-5 pb-3 pointer-events-auto">
        <div className="relative bg-paper border-[1.5px] border-ink rounded-full flex items-stretch shadow-[0_2px_0_0_#0F0F0F]">
          {TABS.map((t) => {
            const active = pathname === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => router.push(t.key)}
                className="relative flex-1 flex flex-col items-center justify-center py-1.5 text-ink"
                aria-current={active ? "page" : undefined}
                aria-label={t.label}
              >
                {active && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-1 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 flex flex-col items-center gap-0.5 ${
                    active ? "text-paper" : "text-ink"
                  }`}
                >
                  {t.icon}
                  <span className="text-[11px] font-medium leading-none">{t.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
