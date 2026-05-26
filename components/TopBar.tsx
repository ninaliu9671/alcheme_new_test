"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarBullet from "./StarBullet";
import SettingsDrawer from "./SettingsDrawer";

type Variant = "tab" | "sub";

type Props = {
  onBack?: () => void;
  /** Override the default settings drawer with a custom handler. */
  onSettings?: () => void;
  /** "tab" = top-level tabbed page (no back btn). "sub" = sub-page (back btn, no settings). */
  variant?: Variant;
};

export default function TopBar({ onBack, onSettings, variant = "tab" }: Props) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };
  const handleSettings = () => {
    if (onSettings) onSettings();
    else setSettingsOpen(true);
  };

  return (
    <div className="relative flex items-center justify-between h-10 px-1">
      {variant === "sub" ? (
        <button
          type="button"
          aria-label="back"
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      ) : (
        <span className="w-8 h-8" aria-hidden />
      )}

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <span aria-hidden style={{ transform: "scale(0.7)" }}>
          <StarBullet size={14} />
        </span>
        <span className="font-pixel text-[12px] tracking-wide text-ink">Alcheme</span>
        <span aria-hidden style={{ transform: "scale(0.7)" }}>
          <StarBullet size={14} />
        </span>
      </div>

      {variant === "tab" ? (
        <button
          type="button"
          aria-label="settings"
          onClick={handleSettings}
          className="w-8 h-8 flex items-center justify-center text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      ) : (
        <span className="w-8 h-8" aria-hidden />
      )}

      {variant === "tab" && !onSettings && (
        <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
